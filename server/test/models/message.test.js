const net = require('net');
const Message = require('../../src/models/message');
const User = require('../../src/models/user');

let user, user2;
let message;

describe('Message unit tests model', () => {
  beforeEach(() => {
    user = new User(new net.Socket());
    user2 = new User(new net.Socket());
    message = new Message('Message', user);
  });

  test('should creates a broadcast message', () => {
    expect(message.from).toMatchObject(user);
    expect(message.to).toBeUndefined();
    expect(message.content).toBe('Message');
    expect(message.sentAt).toBeInstanceOf(Date);
  });

  test('shoud creates a public message to user', () => {
    message.to = user2;
    expect(message.to).toMatchObject(user2);
  });

  test('should creates a private message to user', () => {
    message.to = user2;
    expect(message.to).toMatchObject(user2);
    expect(message.private).toBe(false);
    message.private = true;
    expect(message.private).toBe(true);
  });
});
