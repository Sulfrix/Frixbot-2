const { Message } = require('discord.js')
var Command = require('../lib/Command')

class ClearCommand extends Command {
  constructor(owner) {
    super("Clear Command", ["clear", "purge"], owner)
    this.desc = "Deletes up to 100 messages in a channel."
    this.usage = "clear [max]\n[max] - (optional) the maximum messages to clear in the channel."
    this.perms = ["MANAGE_MESSAGES"]
    this.dmAllowed = false;
  }

  init() {

  }
  /**
   * 
   * @param {Message} message 
   * @param {String[]} args 
   */
  invoke(message, args) {
    let max = 100;
    if (args[1]) {
      if (parseInt(args[1])) {
        max = parseInt(args[1])
      }
    }
    if (max > 100) {
      message.channel.send("Max clear amount is 100")
      return false
    }

    message.channel.bulkDelete(max)

  }
}

module.exports = ClearCommand