const User = require('./user');

module.exports = class Message {
  /**
   * Creates a new message instance
   * @param {string} content - Message content
   * @param {User} from - The user who sends the message
   */
  constructor(content, from) {
    this._content = content;
    this._from = from;
    this._sentAt = new Date();
  }

  get from() {
    return this._from;
  }

  /**
   * Message recipient
   * @returns {User}
   */
  get to() {
    return this._to;
  }

  /**
   * @param {User} recipient
   */
  set to(recipient) {
    this._to = recipient;
  }

  /**
   * @returns {string} Message content
   */
  get content() {
    return this._content;
  }

  /**
   * Returns if it is a broadcast message
   * @returns {bool}
   */
  isToBroadcast() {
    return this.to ? false : true;
  }

  /**
   *
   */
  get private() {
    return this.to && this._isPrivate ? true : false;
  }

  /**
   *
   */
  set private(isPrivate) {
    this._isPrivate = isPrivate;
  }

  /**
   *
   */
  get sentAt() {
    return this._sentAt;
  }
};
