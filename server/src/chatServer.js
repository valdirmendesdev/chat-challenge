const net = require('net')
const User = require('./models/user')

class ChatServer {

  constructor() {
    this.connections = []
  }

  createUserToConnection(connection) {
    this.connections[connection] = new User()
    return this.connections[connection]
  }

}

module.exports = ChatServer

// constructor() {
//   this.tcpServer = net.createServer()
//   this.tcpServer.on('connection', this._onNewConnection)
//   // this.tcpServer.on()
// }

// _onNewConnection(newConnection){
//   newConnection.write('Welcome to our Chat Server!')
//   newConnection.on('data', data => {
//     console.log(data.toString())
//   })
// }

// listen(port) {
//   this.tcpServer.listen(port)
// }

// stop() {
//   this.tcpServer.close()
// }

// const server = net.createServer()

// const newConnection = connection => {
//   connection.setEncoding('UTF-8')
//   console.log('Conectou!')
// }

// server.on('connection', newConnection);

// server.on('close', () => { 
//   console.log(`Server disconnected`);
// });

// server.on('error', error => { 
//   console.log(`Error : ${error}`);
// });

// server.on('data', data => {
//   console.log(data)
// })

// server.listen(4000)