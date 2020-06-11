const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = net.createConnection({ port: 4000 });

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
