const net = require('net');
const User = require('./models/user');
const Room = require('./models/room');
const Parser = require('./models/parser');
const Message = require('./models/message');

const defaultRoomAlias = '#general';

class ChatServer {
  constructor(port) {
    this._clients = new Map();
    this._rooms = new Map().set(defaultRoomAlias, new Room(defaultRoomAlias));
    this._parser = new Parser();
    this._server = net.createServer();
    this.port = port;
  }

  /**
   *
   * @param {net.Socket} client
   */
  onNew(client) {
    this._clients.set(client, new User(client));
    client.on('data', data => {
      this.onNewInput(client, data);
    });
    client.on('end', () => {
      this.disconnect(client);
    })
    client.write('Welcome to our chat server. Please provide a nickname..')
  }

  /**
   *
   * @param {string} input
   */
  onNewInput(client, input) {

    const userInput = input.toString();

    const user = this.getUser(client);
    if (!user.nickname) {
      try {
        this.setNickname(client,userInput);
      } catch (error) {
        console.log(error);
        client.write(`${error.message}. Please choose a different one!`);
        return;
      }
      this.addToRoom(client,defaultRoomAlias);
      return;
    }
    const parsed = this._parser.parse(userInput);
    if (!parsed) {
      const message = new Message(userInput, user);
      this.getRoomByAlias(defaultRoomAlias).sendMessage(message);
    }
  }

  /**
   *
   */
  get numberOfClients() {
    return this._clients.size;
  }

  /**
   *
   * @param {net.Socket} client
   */
  getUser(client) {
    return this._clients.get(client);
  }

  /**
   *
   * @param {net.Socket} client
   * @param {string} nickname
   */
  setNickname(client, nickname) {
    this._clients.forEach((u) => {
      if (u.nickname === nickname) {
        throw new Error('Already exists a user with this nickname');
      }
    });

    this.getUser(client).nickname = nickname;
  }

  /**
   *
   * @param {string} alias
   */
  getRoomByAlias(alias) {
    return this._rooms.get(alias);
  }

  /**
   *
   * @param {net.Socket} client
   * @param {string} roomAlias
   */
  addToRoom(client, roomAlias) {
    const user = this.getUser(client);
    const room = this.getRoomByAlias(roomAlias);
    room.addUser(user);
  }

  /**
   *
   * @param {net.Socket} client
   */
  disconnect(client) {
    const user = this.getUser(client);
    user.room.removeUser(user);
    this._clients.delete(client);

    client.destroy();
  }

  /**
   *
   */
  start() {
    this._server.on('connection', client => {
      this.onNew(client)
    });
    this._server.listen(this.port, () => {
      console.log('Server started...')
    })
  }
}
module.exports = { ChatServer, defaultRoomAlias };
