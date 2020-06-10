module.exports = class Parser {
  constructor() {
    this.commands = [];
    this.commands.push({
      regex: /\/to (\w+) (.+)/,
      command: '/to',
      description: '/to {user} {message} -> sends a public message to user',
    });
    this.commands.push({
      regex: /\/p (\w+) (.+)/,
      command: '/p',
      description: '/p {user} {message} -> sends a private message to user',
    });
    this.commands.push({
      regex: /\/disconnect/,
      command: '/disconnect',
      description: '/disconnect -> Disconnect from chat',
    });
    this.commands.push({
      regex: /\/help/,
      command: '/help',
      description: '/help -> Shows all commands',
    });
  }

  /**
   *
   * @param {string} statement
   */
  parse(statement) {
    for (const command of this.commands) {
      const parsedStatement = statement.match(command.regex);
      if (parsedStatement) {
        return {
          command: command.command,
          parsedStatement,
        };
      }
    }
  }
};
