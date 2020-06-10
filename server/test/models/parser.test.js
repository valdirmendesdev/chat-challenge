const Parser = require('../../src/models/parser');

let parser;

describe('Parser Unit tests', () => {
  beforeEach(() => {
    parser = new Parser();
  });

  test('should returns parsed "public message to user" command', () => {
    const parsed = parser.parse('/to testUser hello!');
    const [, username, message] = parsed.parsedStatement;
    expect(parsed.command).toBe('/to');
    expect(username).toBe('testUser');
    expect(message).toBe('hello!');
  });

  test('should returns parsed "private message to user" command', () => {
    const parsed = parser.parse('/p testUser hello!');
    const [, username, message] = parsed.parsedStatement;
    expect(parsed.command).toBe('/p');
    expect(username).toBe('testUser');
    expect(message).toBe('hello!');
  });

  test('should returns parsed disconnect command', () => {
    const parsed = parser.parse('/disconnect');
    expect(parsed.command).toBe('/disconnect');
  });

  test('should returns parsed help command', () => {
    const parsed = parser.parse('/help');
    expect(parsed.command).toBe('/help');
  });

  test('should return undefined to unknown command', () => {
    const parsed = parser.parse('/error');
    expect(parsed).toBeUndefined();
  });
});
