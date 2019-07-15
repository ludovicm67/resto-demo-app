// import all required stuff
const express = require('express');
const prom = require('prom-client');
const redis = require('redis');
const server = express();
const register = prom.register;

// connect to redis
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;
const redis_client = redis.createClient(redis_port, redis_host);
const redis_close_connection = () => {
 redis_client.quit();
 console.log('connection to redis client closed.');
 process.exit(1);
};
redis_client.on('connect', () => {
  console.log('connected to redis.');
});
redis_client.on('error', (err) => {
  console.error(`Error: unable to connect to redis (${err}).`);
  process.exit(1);
});

// setup our metric
const Gauge = prom.Gauge;
const g = new Gauge({
	name: 'queue',
	help: 'Queue size for a specific worker',
	labelNames: ['worker']
});

// some random stuff
const random_queue_size = () => {
  return Math.round(Math.random() * 50);
}

setInterval(() => {
	g.set({ worker: 'dish' }, random_queue_size());
}, 100);

setInterval(() => {
	g.set({ worker: 'drink' }, random_queue_size());
}, 100);

setInterval(() => {
	g.set({ worker: 'dessert' }, random_queue_size());
}, 100);

// route for probes
server.get('/health', (_req, res) => {
  res.end('backend is up!');
});

// expose metrics
server.get('/metrics', (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

// start the server
server.listen(3000, () => {
  console.log('server listening on port 3000.');
});

// close redis connection on exit
process.on('exit', redis_close_connection);
