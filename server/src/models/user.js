const net = require('net');
const Room = require('./room');

module.exports = class User {
  /**
   * @param {net.Socket} client
   */
  constructor(client) {
    this._client = client;
  }

  /**
   * @param {string} newNickname
   */
  set nickname(newNickname) {
    this._nickname = newNickname;
  }

  /**
   * @returns {string}
   */
  get nickname() {
    return this._nickname;
  }

  /**
   * @returns {net.Socket}
   */
  get client() {
    return this._client;
  }

  /**
   * @param {Room} room
   */
  set room(room) {
    this._room = room;
  }

  /**
   * @returns {Room}
   */
  get room() {
    return this._room;
  }
};
