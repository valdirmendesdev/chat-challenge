const net = require('net');
const Room = require('../../src/models/room');
const Message = require('../../src/models/message');
const User = require('../../src/models/user');

let room, user;

describe('Unit tests Room model', () => {
  beforeEach(() => {
    room = new Room('testRoom', new net.Socket());
    user = new User('testUser', new net.Socket());
  });

  test('should adds a user to room', () => {
    room.addUser(user);
    expect(room.users).toBeTruthy();
    expect(room.users.length).toBe(1);
  });

  test('should not adds a user with same nickname', () => {
    const user2 = new User('testUser');
    room.addUser(user);
    expect(() => room.addUser(user2)).toThrowError(
      'Already exists a user with this nickname'
    );
  });

  test('should removes a user', () => {
    room.addUser(user);
    expect(room.users.length).toBe(1);
    expect(room.removeUser(user)).toBeTruthy();
    expect(room.users.length).toBe(0);
  });

  test('should not removes a nonexistent user', () => {
    room.addUser(user);
    expect(room.users.length).toBe(1);
    const user2 = new User('User2')
    expect(room.removeUser(user2)).toBeFalsy();
    expect(room.users.length).toBe(1);
  })

  test('', () => {
    
  })

});
