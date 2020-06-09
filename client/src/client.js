const net = require('net')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'option > '
});

const client = net.createConnection({ port: 4000 });
client.on('data', data => {
  console.log(data.toString());
  rl.prompt()
});

client.on('end', () => {
  console.log('disconnected from server');
});



rl.on('line', input => {
  client.write(input)
  rl.prompt()
})

