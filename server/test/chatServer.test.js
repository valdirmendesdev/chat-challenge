const net = require('net');
const { ChatServer, defaultRoomAlias } = require('../src/chatServer');
const User = require('../src/models/user');
const Room = require('../src/models/room');
const Message = require('../src/models/message');
const Parser = require('../src/models/parser');

const portToTest = 4101;
const mWrite = jest.fn();

describe('Unit tests ChatServer', () => {
  let chatServer, client, room;

  beforeEach(() => {
    chatServer = new ChatServer(portToTest);
    client = createNewClient();
    chatServer.onNew(client);
    chatServer.setNickname(client, 'testNickname');
    room = chatServer.getRoomByAlias(defaultRoomAlias);
  });

  test('should creates a user on a new client', () => {
    expect(chatServer.numberOfClients).toBe(1);
    expect(chatServer.getUser(client)).toBeTruthy();
    expect(chatServer.getUser(client)).toBeInstanceOf(User);
  });

  test('should throws an exception - Nickname already in use', () => {
    newClient = createNewClient();
    chatServer.onNew(newClient);
    expect(() =>
      chatServer.setNickname(newClient, 'testNickname')
    ).toThrowError(
      'Already exists a user with this testNickname nickname. Please choose a different one!'
    );
  });

  test('should returns a room by alias', () => {
    expect(room).toBeInstanceOf(Room);
    expect(room.alias).toBe(defaultRoomAlias);
  });

  test('should adds user to room by room alias', () => {
    const user = chatServer.getUser(client);
    chatServer.addToRoom(client, defaultRoomAlias);
    expect(user.room).toMatchObject(room);
  });

  test('should disconnect user from chat', () => {
    chatServer.addToRoom(client, defaultRoomAlias);
    chatServer.disconnect(client);
    expect(chatServer.numberOfClients).toBe(0);
    expect(room.numberOfUsers).toBe(0);
  });

  test('should returns all commands text', () => {
    expect(chatServer.getHelp().split('\n').length).toBe(7);
  });

  test('should returns command params from parsedStatement', () => {
    const parser = new Parser();
    const parsed = parser.parse('/to user message');
    const expected = {
      nickname: 'user',
      message: 'message',
    };
    expect(
      chatServer.getParamsFromMessageToCommand(parsed.parsedStatement)
    ).toMatchObject(expected);
  });

  test('should catch help information', () => {
    chatServer.onNewInput(client, '/help');
    expect(mWrite.mock.calls[1][0]).toBe(
      'Command anatomy -> Command description\n' +
        '\n' +
        '/to {user} {message} -> sends a public message to user\n' +
        '/p {user} {message} -> sends a private message to user\n' +
        '/disconnect -> Disconnect from chat\n' +
        '/help -> Shows all commands\n'
    );
  });


  test('should catch a warning message - Nickname already exists', () => {
    const newClient = onNewClient();
    mWrite.mockReset();
    chatServer.onNewInput(newClient, 'testNickname');
    expect(mWrite.mock.calls[0][0]).toBe('Already exists a user with this testNickname nickname. Please choose a different one!');

  })

  test('should catch a public message to broadcast', () => {
    chatServer.addToRoom(client, defaultRoomAlias);
    mWrite.mockReset();
    chatServer.onNewInput(client, 'public message!');
    expect(mWrite.mock.calls[0][0]).toBe('testNickname says: public message!');
  });

  test('should catch a public message to user', () => {
    chatServer.addToRoom(client, defaultRoomAlias);
    const newClient = addNewClient('otherUser');
    chatServer.addToRoom(newClient, defaultRoomAlias);
    mWrite.mockReset();
    chatServer.onNewInput(client, '/to otherUser Hello');
    expect(mWrite.mock.calls[0][0]).toBe(
      'testNickname says to otherUser: Hello'
    );
  });

  test('should catch a warning message - there is no user with this nickname at room ', () => {
    chatServer.addToRoom(client, defaultRoomAlias);
    addNewClient('otherUser');
    mWrite.mockReset();
    chatServer.onNewInput(client, '/to otherUser Hello');
    expect(mWrite.mock.calls[0][0]).toBe(
      'Theres is no user with this nickname at room'
    );
  });

  test('should catch a public message to user', () => {
    chatServer.addToRoom(client, defaultRoomAlias);
    const newClient = addNewClient('otherUser');
    chatServer.addToRoom(newClient, defaultRoomAlias);
    mWrite.mockReset();
    chatServer.onNewInput(client, '/p otherUser Hello');
    expect(mWrite.mock.calls[0][0]).toBe(
      'testNickname says privately to otherUser: Hello'
    );
  });

  test('should disconnect the client with room', () => {
    expect(chatServer.numberOfClients).toBe(1);
    chatServer.addToRoom(client, defaultRoomAlias);
    chatServer.onNewInput(client, '/disconnect');
    expect(chatServer.numberOfClients).toBe(0);
  });

  test('should disconnect the client without room', () => {
    expect(chatServer.numberOfClients).toBe(1);
    chatServer.onNewInput(client, '/disconnect');
    expect(chatServer.numberOfClients).toBe(0);
  });

  afterEach(() => {
    mWrite.mockReset();
  });

  onNewClient = () => {
    const newClient = createNewClient();
    chatServer.onNew(newClient);
    return newClient;
  }

  addNewClient = (nickname) => {
    const newClient = onNewClient();
    chatServer.setNickname(newClient, nickname);
    return newClient;
  };

  createNewClient = () => {
    const client = new net.Socket();
    client.write = mWrite;
    return client;
  };

});

/***************** Integration tests *******************/
describe('Integration tests ChatServer', () => {
  let chat, clientConnection;

  beforeEach((done) => {
    chat = new ChatServer(portToTest);
    chat.start();
    clientConnection = net.connect(portToTest);
    done();
  });

  test('should connects and returns the welcome message', (done) => {
    clientConnection.on('data', (data) => {
      expect(data.toString()).toBe(
        'Welcome to our chat server. Please provide a nickname..'
      );
      done();
    });
  });

  test('should input the nickname and joins a general room', (done) => {
    let numberOfInteractions = 0;

    clientConnection.on('data', (data) => {
      numberOfInteractions++;

      switch (numberOfInteractions) {
        case 1:
          clientConnection.write('nick1');
          break;
        case 2:
          // console.log(data.toString());
          expect(data.toString()).toEqual(
            expect.stringContaining('nick1 has joined #general')
          );
          done();
          break;
        default:
          break;
      }
    });
  });

  afterEach((done) => {
    if (clientConnection.connecting) {
      clientConnection.destroy();
    }
    chat.stop();
    done();
  });
});

