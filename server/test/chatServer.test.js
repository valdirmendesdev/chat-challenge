const net = require('net');
const { ChatServer, defaultRoomAlias } = require('../src/chatServer');
const User = require('../src/models/user');
const Room = require('../src/models/room');

let chatServer, client, room;

describe('Unit tests ChatServer', () => {
  beforeEach(() => {
    chatServer = new ChatServer(1000);
    client = new net.Socket();
    chatServer.onNew(client);
    room = chatServer.getRoomByAlias(defaultRoomAlias);
  });

  test('should creates a user on a new client', () => {
    expect(chatServer.numberOfClients).toBe(1);
    expect(chatServer.getUser(client)).toBeTruthy();
    expect(chatServer.getUser(client)).toBeInstanceOf(User);
  });

  test('should throws an exception - Nickname already in use', () => {
    chatServer.setNickname(client, 'testNickname');
    newClient = new net.Socket();
    chatServer.onNew(newClient);
    expect(() =>
      chatServer.setNickname(newClient, 'testNickname')
    ).toThrowError('Already exists a user with this nickname');
  });

  test('should returns a room by alias', () => {
    expect(room).toBeInstanceOf(Room);
    expect(room.alias).toBe(defaultRoomAlias);
  });

  test('should adds user to room by room alias', () => {
    const user = chatServer.getUser(client);
    chatServer.addToRoom(client, defaultRoomAlias);
    expect(user.room).toMatchObject(room);
  });

  test('should disconnect user from chat', () => {
    chatServer.addToRoom(client, defaultRoomAlias);
    chatServer.disconnect(client);
    expect(chatServer.numberOfClients).toBe(0);
    expect(room.numberOfUsers).toBe(0);
  });
});

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
