const net = require('net');
const Message = require('../../src/models/message');
const User = require('../../src/models/user');

let user, user2;
let message;

describe('Unit tests Message model', () => {
  beforeEach(() => {
    user = new User('User1', new net.Socket());
    user2 = new User('User2', new net.Socket());
  });

  test('should creates a broadcast message', () => {
    message = new Message('Message', user);
    expect(message.from).toMatchObject(user);
    expect(message.to).toBeUndefined();
    expect(message.content).toBe('Message');
    expect(message.sentAt).toBeInstanceOf(Date);
    expect(message.isToBroadcast()).toBe(true);
  });

  test('shoud creates a public message to user', () => {
    message = new Message('Message to user', user);
    message.to = user2;
    expect(message.to).toMatchObject(user2);
    expect(message.isToBroadcast()).toBe(false);
  });

  test('should creates a private message to user', () => {
    message = new Message('Message to user', user);
    message.to = user2;
    expect(message.to).toMatchObject(user2);
    expect(message.private).toBe(false);
    message.private = true;
    expect(message.private).toBe(true);
  });
});
