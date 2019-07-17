// redis
const redis = require('redis');
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;
const redis_client = redis.createClient(redis_port, redis_host);

// redis listeners
redis_client.on('connect', () => {
  console.log('connected to redis.');
});
redis_client.on('error', (err) => {
  console.error(`Error: unable to connect to redis (${err}).`);
  process.exit(1);
});

// setup worker
const worker_duration = process.env.WORKER_DURATION || 10;
const worker_name = process.env.WORKER_NAME || 'anonymous';
const allowed_workers = [
  'dish',
  'drink',
  'dessert'
];

// check if worker is allowed
if (!allowed_workers.includes(worker_name)) {
  console.error(`worker '${worker_name}' not allowed`);
  process.exit(1);
}

// just say "hi"
console.log(`worker '${worker_name}' is ready!`);

// the worker is working periodically
setInterval(() => {
  console.log(`worker '${worker_name}' is looking for a task for ${worker_duration}s...`);
  redis_client.llen(worker_name, (err, reply) => {
    if (err) console.error(`Error: ${err}`);
    else if (reply === 0) console.log('no remaining tasks...');
    else {
      console.log(`${worker_name}'s workers have ${reply} items in queue`);
      redis_client.lpop(worker_name, (err, reply) => {
        if (err) console.error('worker had a problem during work...');
        else console.log(`worker successfully executed task for: ${reply}`);
      });
    }
  });
}, worker_duration * 1000);
