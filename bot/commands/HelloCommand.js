const { Message } = require('discord.js')
var Command = require('../lib/Command')

class HelloCommand extends Command {
  constructor(owner) {
    super("Hello Command", ["hello", "hi"], owner)
    this.desc = "Hello!"
    this.usage = `hello`
  }

  init() {

  }
  /**
   * 
   * @param {Message} message 
   */
  invoke(message, args) {
    message.reply("Hello!")
  }
}

module.exports = HelloCommand