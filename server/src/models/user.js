const net = require('net');

module.exports = class User {

  /**
   * @param {string} nickname
   * @param {net.Socket} connection 
   */
  constructor(nickname, connection) {
    this.nickname = nickname;
    this._connection = connection;
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
};
