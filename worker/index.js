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
