// redis
const redis = require('redis');
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
process.on('exit', redis_close_connection);

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
  console.log(`worker '${worker_name}' is working for ${worker_duration}s...`);
}, worker_duration * 1000);
