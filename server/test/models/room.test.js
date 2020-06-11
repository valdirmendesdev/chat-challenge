// jest.mock('net');
const net = require('net');
const Room = require('../../src/models/room');
const Message = require('../../src/models/message');
const User = require('../../src/models/user');

let room, user, client, message;

const mWrite = jest.fn();

describe('Room unit tests model', () => {
  beforeEach(() => {
    room = new Room('testRoom');
    client = createClient();
    user = createNewUser(client);
    user.nickname = 'testUser';
    room.addUser(user);
    message = new Message('Hello!', user);
  });

  test('should adds a user to room', () => {
    expect(room.alias).toBe('testRoom');
    expect(room.users).toBeTruthy();
    expect(room.numberOfUsers).toBe(1);
    expect(user.room).toMatchObject(room);
  });

  test('should removes a user', () => {
    expect(room.numberOfUsers).toBe(1);
    expect(room.removeUser(user)).toBeTruthy();
    expect(room.numberOfUsers).toBe(0);
    expect(user.room).toBeUndefined();
  });

  test('should not removes a nonexistent user', () => {
    const user2 = createNewUser();
    expect(room.numberOfUsers).toBe(1);
    expect(room.removeUser(user2)).toBeFalsy();
    expect(room.numberOfUsers).toBe(1);
  });

  test('should sends a public message to all users', () => {
    room.addUser(createNewUser(createClient()));
    room.sendMessage(message);
    expect(mWrite).toHaveBeenCalled();
    expect(room.messages.length).toBe(1)
  })

  test('should sends a public message to specific user', () => {
    const user2 = createNewUser(createClient());
    room.addUser(user2);
    message.to = user2;
    room.sendMessage(message);
    expect(mWrite).toHaveBeenCalled();
    expect(room.messages.length).toBe(1)
  })


  test('should sends a private message to specific user', () => {
    const user2 = createNewUser(createClient());
    room.addUser(user2);
    message.to = user2;
    message.private = true;
    room.sendMessage(message);
    expect(mWrite).toHaveBeenCalled();
    expect(room.messages.length).toBe(1)
  })

  test('should returns a user by nickname', () => {
    expect(room.getUser('testUser')).toMatchObject(user);
  })

  test('should not returns a user by unknown nickname', () => {
    expect(room.getUser('fail')).toBeUndefined();
  })

  afterEach(() => {
    mWrite.mockReset();
  })

});

createClient = () => {
  const client = new net.Socket();
  client.write = mWrite;
  return client;
}

createNewUser = (client) => {
  return new User(client);
};
