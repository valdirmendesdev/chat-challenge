const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const port = process.env.PORT || 4000;

const client = net.createConnection({ port });

client.on('data', (data) => {
  console.log(`${data.toString()}`);
});

client.on('end', () => {
  console.log('disconnected from server');
  process.exit(0);
});

rl.on('line', (input) => {
  client.write(input);
  console.log('\n')
});
