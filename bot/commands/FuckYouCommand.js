const { Message } = require('discord.js')
var Command = require('../lib/Command')

class FuckYouCommand extends Command {
  constructor(owner) {
    super("Fuck You Command", ["fuck", "fuckyou"], owner);
    this.desc = "Fuck you."
    this.usage = "fuck"
  }

  init () {}
  /**
   * 
   * @param {Message} message 
   */
  invoke(message) {
    message.reply("Fuck you!")
  }
}

module.exports = FuckYouCommand;