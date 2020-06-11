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
    client.on('data', (data) => {
      this.onNewInput(client, data);
    });
    client.on('end', () => {
      this.disconnect(client);
    });
    client.write('Welcome to our chat server. Please provide a nickname..');
  }

  /**
   * @param {net.Client} client
   * @param {string} input
   */
  onNewInput(client, input) {
    const userInput = input.toString();

    const user = this.getUser(client);
    if (!user.nickname) {
      try {
        this.setNickname(client, userInput);
      } catch (error) {
        client.write(error.message);
        return;
      }
      this.addToRoom(client, defaultRoomAlias);
      client.write('Type a public message or /help to show all commands');
      return;
    }

    this.processCommand(user, userInput);

  }

  /**
   * 
   * @param {User} user 
   * @param {string} command 
   */
  processCommand(user, command) 
  {

    const parsed = this._parser.parse(command);
    //Broadcast message
    if (!parsed) {
      this.getRoomByAlias(defaultRoomAlias).sendMessage(
        new Message(command, user)
      );
      return;
    }

    let message;
    try {
      switch (parsed.command) {
        case '/help':
          user.client.write(this.getHelp());
          break;
        case '/to':
          message = this._createMessageToUser(user, parsed.parsedStatement);
          user.room.sendMessage(message);
          break;
        case '/p':
          message = this._createMessageToUser(user, parsed.parsedStatement);
          message.private = true;
          user.room.sendMessage(message);
          break;
        case '/disconnect':
          this.disconnect(user.client);
          break;
      }
    } catch (error) {
      user.client.write(error.message);
      return;
    }
  }

  /**
   * 
   * @param {User} sender 
   * @param {object} parsedStatement 
   */
  _createMessageToUser(sender, parsedStatement) {
    const commandParams = this.getParamsFromMessageToCommand(parsedStatement);
    const recipientUser = sender.room.getUser(commandParams.nickname);
    if (!recipientUser) {
      throw new Error('Theres is no user with this nickname at room');
    }
    const message = new Message(commandParams.message, sender);
    message.to = recipientUser;
    return message;
  }

  /**
   * @returns {number}
   */
  get numberOfClients() {
    return this._clients.size;
  }

  /**
   *
   * @param {net.Socket} client
   * @returns {User}
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
        throw new Error(
          `Already exists a user with this ${nickname} nickname. Please choose a different one!`
        );
      }
    });

    this.getUser(client).nickname = nickname;
  }

  /**
   *
   * @param {string} alias
   * @returns {Room}
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
    if (user.room) {
      user.room.removeUser(user);
    }
    this._clients.delete(client);
    client.destroy();
  }

  getHelp() {
    let allCommands = 'Command anatomy -> Command description\n\n';
    this._parser.commands.map((command) => {
      allCommands = allCommands.concat(command.description, '\n');
    });
    return allCommands;
  }

  /**
   * 
   * @param {Array} parsedStatement 
   * @returns {object}
   */
  getParamsFromMessageToCommand(parsedStatement) {
    const [, nickname, message] = parsedStatement;
    return {
      nickname,
      message,
    };
  }
  /**
   *
   */
  start() {
    this._server.on('connection', (client) => {
      this.onNew(client);
    });
    this._server.listen(this.port, () => {
      if (process.env.NODE_ENV != 'test') {
        console.log('Server started...');
      }
    });
  }

  stop() {
    this._clients.forEach((user, client) => {
      client.destroy();
    });
    this._server.close();
  }
}
module.exports = { ChatServer, defaultRoomAlias };
