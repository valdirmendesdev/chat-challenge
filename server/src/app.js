const { ChatServer } = require('./chatServer')

const port = process.env.PORT || 4000;
const chat = new ChatServer(port);
chat.start()
