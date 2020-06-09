const net = require('net')
const User = require('../../src/models/user');

let user;

describe('Unit tests User model', () => {
  beforeEach(() => {
    user = new User('testUser', new net.Socket());
  });

  test('should sets the nickname to the user', () => {
    user.nickname = 'user';
    expect(user.nickname).toBe('user');
  });
});
