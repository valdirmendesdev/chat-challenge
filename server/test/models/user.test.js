const net = require('net');
const User = require('../../src/models/user');
const Room = require('../../src/models/room');

let user;

describe('User unit tests model', () => {
  beforeEach(() => {
    user = new User(new net.Socket());
  });

  test('should sets the nickname to the user', () => {
    expect(user.client).toBeTruthy();
    expect(user.client).toBeInstanceOf(net.Socket);
    expect(user.nickname).toBeUndefined();
    user.nickname = 'testUser';
    expect(user.nickname).toBe('testUser');
  });

  test('should sets a room chat to the user', () => {
    expect(user.room).toBeUndefined();
    const room = new Room('testRoom'); 
    user.room = room;
    expect(user.room).toBeInstanceOf(Room);
    expect(user.room).toMatchObject(room);
  });
});
