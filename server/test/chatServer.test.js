const net = require('net')
const ChatServer = require('../src/chatServer')
const User = require('../src/models/user')


let chatServer;

describe('ChatServer features tests', () => {

  beforeEach(() => {
    chatServer = new ChatServer()
  })

  test('should creates a new user for the connection', () => {
    expect(chatServer
            .createUserToConnection(new net.Socket())
          ).toBeInstanceOf(User)
  })

  test('should sets the nickname for the user', () => {
    
  })

})


// const port = process.env.PORT || 4000;
// let chatServer;

// describe('Server tests', () => {

//   beforeEach(done => {
//     chatServer = new ChatServer();
//     chatServer.listen(port)
//     done();
//   })

//   test('first user connection', () => {
//     const client = net.connect(port)
//     client.on('data', (data) => {
//       expect(data.toString()).toBe('Welcome to our Chat Server! ')
//       client.write('')
//       client.destroy()
//       chatServer.stop()
//     })
//   })


// })