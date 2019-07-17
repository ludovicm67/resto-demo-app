// import all required stuff
const fs = require('fs');
const express = require('express');
const prom = require('prom-client');
const redis = require('redis');
const cors = require('cors');
const fetch = require('node-fetch');
const server = express();
const register = prom.register;
server.use(express.json());
server.use(cors());

// we are in a k8s cluster, default service account token is mounted here
const token = fs.readFileSync(
  '/var/run/secrets/kubernetes.io/serviceaccount/token',
  'utf8'
);

// connect to redis
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;
const redis_client = redis.createClient(redis_port, redis_host);
redis_client.on('connect', () => {
  console.log('connected to redis.');
});
redis_client.on('error', (err) => {
  console.error(`Error: unable to connect to redis (${err}).`);
  process.exit(1);
});

// setup our metric
const Gauge = prom.Gauge;
const gauges = {
  dish: new Gauge({
    name: 'resto_queue_dish',
    help: 'Queue size for the dish worker'
  }),
  drink: new Gauge({
    name: 'resto_queue_drink',
    help: 'Queue size for the drink worker'
  }),
  dessert: new Gauge({
    name: 'resto_queue_dessert',
    help: 'Queue size for the dessert worker'
  }),
};

// limit worker types
const allowed_workers = [
  'dish',
  'drink',
  'dessert',
];
const validate_worker = (worker_name) => {
  return allowed_workers.includes(worker_name);
};

// some random stuff
Object.keys(gauges).map(function(worker_name, _index) {
  gauges[worker_name].set(0);
});

// update local metrics periodically
setInterval(() => {
  prom.collectDefaultMetrics();
  allowed_workers.map(worker_name => {
    redis_client.llen(worker_name, (err, res) => {
      if (!err) gauges[worker_name].set(res);
    });
  });
}, 1000);

// route for probes
server.get('/health', (_req, res) => {
  res.end('backend is up!');
});

// expose metrics
server.get('/metrics', (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

// get informations about a specific worker
server.get('/worker/:name', (req, res) => {
  const worker_name = req.params.name;
  const response = {
    worker: worker_name,
    params: req.params,
  };

  // check if worker name is valid
  if (!validate_worker(worker_name)) {
    res.status(404).json({
      ...response,
      message: `worker '${worker_name}' not found`,
    });
    return;
  }

  // return informations about the worker
  redis_client.llen(worker_name, (err, reply) => {
    if (err) {
      res.status(500).json({
        ...response,
        message: `cannot get queue size for worker '${worker_name}'`,
      });
    } else {
      res.json({
        ...response,
        message: `worker '${worker_name}' has ${reply} items in his queue`,
        queue_lenth: reply,
      });
    }
  });
});

// update task for a specific worker
server.post('/worker/:name', (req, res) => {
  const worker_name = req.params.name;
  const response = {
    worker: worker_name,
    params: req.params,
    body: req.body,
  };

  // check if worker name is valid
  if (!validate_worker(worker_name)) {
    res.status(404).json({
      ...response,
      message: `worker '${worker_name}' not found`,
    });
    return;
  }

  // check if the query contain a name for a task
  if (!req.body || !req.body.name) {
    res.status(400).json({
      ...response,
      message: 'Bad query. Please check the documentation.',
    });
    return;
  }

  // manage cases where we want multiple instances of the task
  let count = 1;
  if (req.body.count && req.body.count > 0) {
    count = parseInt(req.body.count);
  }

  // push tasks to a redis list
  for (let i = 0; i < count; i++) {
    redis_client.rpush([worker_name, req.body.name], (err, _reply) => {
      if (err) {
        res.status(500).json({
          ...response,
          message: `something went wrong during work#${i} for worker '${worker_name}'`,
        });
        return;
      }
    });
  }

  // give feedback to user
  res.json({
    ...response,
    message: `worker '${worker_name}' was updated`,
  });
});

// get global status
server.get('/status', (request, response) => {
  const status = {};
  const promises = [];

  // fetch setup
  const cluster_url = 'https://kubernetes.default.svc';
  const api_namespace = '/apis/autoscaling/v2beta2/namespaces/resto-demo-app';
  const api_worker_endpoint = '/horizontalpodautoscalers/resto-demo-app-worker-';
  const request_options = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  // fetch informations for each worker
  allowed_workers.map(worker_name => {
    status[worker_name] = gauges[worker_name].get();
    status[worker_name].value = status[worker_name].values[0].value;
    delete status[worker_name].aggregator;
    delete status[worker_name].values;

    // push promises for hpa requests in one array
    promises.push(fetch(
      `${cluster_url}${api_namespace}${api_worker_endpoint}${worker_name}`,
      request_options
    ).then(res => {
      return res.json();
    }).then(res => {
      const s = res.status;
      s.worker = s.currentMetrics[0].object.metric.name.replace('resto_queue_', '');
      s.currentValue = parseInt(s.currentMetrics[0].object.current.value);
      delete s.conditions;
      delete s.currentMetrics;
      return s;
    }).catch(e => {
      console.error(e);
    }));
  });

  // wait that all hpa requests are done
  Promise.all(promises).then(res => {
    res.map(hpa => {
      if (validate_worker(hpa.worker)) {
        status[hpa.worker].hpa = hpa;
        delete status[hpa.worker].hpa.worker;
      }
    });
    response.json(status);
  });
});

// start the server
server.listen(3000, () => {
  console.log('server listening on port 3000.');
});
