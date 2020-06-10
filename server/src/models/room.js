const net = require('net');
const User = require('./user');
const Message = require('./message');

module.exports = class Room {
  /**
   * Creates a new instance of Chat room
   */
  constructor(alias) {
    this._users = new Set();
    this._alias = alias;
    this._messages = [];
  }

  get alias() {
    return this._alias;
  }

  /**
   *
   */
  get users() {
    return this._users;
  }

  /**
   *
   */
  get numberOfUsers() {
    return this._users.size;
  }

  /**
   *
   * @param {User} user
   */
  addUser(user) {
    this._users.add(user);
    user.room = this;
    this._broadcast(`${user.nickname} has joined ${this.alias}`)
  }

  /**
   *
   * @param {User} user
   */
  removeUser(user) {
    const wasDeleted = this._users.delete(user);
    if (wasDeleted) {
      user.room = undefined;
    }
    return wasDeleted;
  }

  /**
   *
   * @param {Message} message
   */
  sendMessage(message) {
    this._messages.push(message);

    if (message.private) {
      this._sendPrivateMessage(message);
    } else {
      const formattedMessage = message.to
        ? `${message.from.nickname} says to ${message.to.nickname}: ${message.content}`
        : `${message.from.nickname} says: ${message.content}`;
      this._broadcast(formattedMessage);
    }
  }

  _sendPrivateMessage(message) {
    const formattedMessage = `${message.from.nickname} says privately to ${message.to.nickname}: ${message.content}`;
    message.to.client.write(formattedMessage);
  }

  /**
   *
   * @param {string} messageContent
   */
  _broadcast(messageContent) {
    this._users.forEach((user) => {
      user.client.write(messageContent);
    });
  }

  /**
   *
   */
  get messages() {
    return this._messages;
  }
};
