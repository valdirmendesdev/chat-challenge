const User = require('./user');
const Message = require('./message');

module.exports = class Room {
    /**
   * 
   * @param {string} alias
   */
  constructor(alias) {
    this._alias = alias;
    this._users = [];
  }

  get users() {
    return this._users;
  }

  /**
   * 
   * @param {User} user 
   */
  addUser(user) {
    const userWithNickname = this._users.find(
      (u) => u.nickname === user.nickname
    );
    if (userWithNickname)
      throw new Error('Already exists a user with this nickname');
    this._users.push(user);
  }

  /**
   * 
   * @param {User} user 
   */
  removeUser(user) {
    const userIndex = this._users.indexOf(user);
    if (userIndex < 0) return false;
    this._users.splice(userIndex, 1);
    return true;
  }
};
