const net = require('net');

module.exports = class User {
  /**
   * @param {net.Socket} client
   */
  constructor(client) {
    this._client = client;
  }

  /**
   * 
   */
  set nickname(newNickname) {
    this._nickname = newNickname;
  }

  /**
   *
   */
  get nickname() {
    return this._nickname;
  }

  /**
   * 
   */
  get client() {
    return this._client;
  }

  set room(room) {
    this._room = room
  }

  get room () {
    return this._room;
  }

};
