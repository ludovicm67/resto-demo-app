Backend
=======

The backend is written using [NodeJS](https://nodejs.org/).

## Routes

The backend use [express](https://expressjs.com/) to expose some specials routes.

### `GET: /status`

This route expose the current status of the application.

Here is an example of response you can have:

```json
{
  "dish": {
    "help": "Queue size for the dish worker",
    "name": "resto_queue_dish",
    "type": "gauge",
    "value": 16,
    "hpa": {
      "lastScaleTime": "2019-07-17T09:55:33Z",
      "currentReplicas": 1,
      "desiredReplicas": 4,
      "currentValue": 17
    }
  },
  "drink": {
    "help": "Queue size for the drink worker",
    "name": "resto_queue_drink",
    "type": "gauge",
    "value": 0,
    "hpa": {
      "currentReplicas": 1,
      "desiredReplicas": 1,
      "currentValue": 0
    }
  },
  "dessert": {
    "help": "Queue size for the dessert worker",
    "name": "resto_queue_dessert",
    "type": "gauge",
    "value": 0,
    "hpa": {
      "currentReplicas": 1,
      "desiredReplicas": 1,
      "currentValue": 0
    }
  }
}
```

For each queue, you will get following informations:
  - `help`: a description for the metric
  - `name`: the name of the metric
  - `type`: the type of the metric used by Prometheus
  - `value`: the current value we have
  - `hpa`: autoscaling values from the Kubernetes API (some delay over metrics)

### `GET: /metrics`

This route exposes our metrics for queues and some other metrics about the pod.

Theses metrics need to be scraped by Prometheus to get the application working as expected.

In our case, we use the following Prometheus client: https://github.com/siimon/prom-client.

If your application is written in an other language, you can look here to find an equivalent: https://prometheus.io/docs/instrumenting/clientlibs/.

### `GET: /health`

A simple route for Kubernetes probes.

See: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/

### `GET: /worker/:worker_name`

Example of result with `GET: /worker/dish`:

```json
{
  "worker": "dish",
  "params": {
    "name": "dish"
  },
  "message": "worker 'dish' has 17 items in his queue",
  "queue_lenth": 17
}
```

It can be used if you want to query the current value of one specific worker.

If you want more metrics, it is recommanded to query `GET:/status` instead.

### `POST: /worker/:worker_name`

If you want to add tasks in a queue for a specific worker, use this route.

Here an example of request for the `dish` worker:

### Query

URL: `POST: /worker/dish`

Headers:
  - `Content-Type`: `application/json`

Body:

```json
{
  "name": "Something to eat",
  "count": 42
}
```

The `name` value is the name of the task. This parameter is required.

The `count` value, is the number the task should be repeated. This parameter is optional.

### Response

And here is the response you should get:

```json
{
  "worker": "dish",
  "params": {
    "name": "dish"
  },
  "body": {
    "name": "Something to eat",
    "count": 42
  },
  "message": "worker 'dish' was updated"
}
```
