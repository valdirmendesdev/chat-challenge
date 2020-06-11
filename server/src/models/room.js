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

  /**
   * @returns {string}
   */
  get alias() {
    return this._alias;
  }

  /**
   * @returns {Set}
   */
  get users() {
    return this._users;
  }

  /**
   * @returns {number}
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
    this._broadcast(`${user.nickname} has joined ${this.alias}\n`)
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

  /**
   * 
   * @param {Message} message 
   */
  _sendPrivateMessage(message) {
    const formattedMessage = `${message.from.nickname} says privately to ${message.to.nickname}: ${message.content}`;
    message.from.client.write(formattedMessage);
    message.to.client.write(formattedMessage);
  }

  /**
   * @param {string} messageContent
   */
  _broadcast(messageContent) {
    this._users.forEach((user) => {
      user.client.write(messageContent);
    });
  }

  /**
   * @return {Array}
   */
  get messages() {
    return this._messages;
  }

  /**
   * 
   * @param {string} nickname 
   */
  getUser(nickname) {
    return Array.from(this._users).find(u => u.nickname === nickname);
  }
};
