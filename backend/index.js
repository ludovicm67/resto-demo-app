// import all required stuff
const express = require('express');
const server = express();
const prom = require('prom-client');
const register = prom.register;

// setup our metric
const Gauge = prom.Gauge;
const g = new Gauge({
	name: 'queue',
	help: 'Queue size for a specific worker',
	labelNames: ['worker']
});

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
