const { Message } = require('discord.js')
var Command = require('../lib/Command')

class TopicCommand extends Command {
  constructor(owner) {
    super("Quick Topic Command", ["topic", "settopic", "qtopic"], owner)
    this.desc = "Allows you to quickly set a channel's topic."
    this.usage = "topic <text>"
    /**
     * @type {import('discord.js').PermissionString[]}
     */
    this.perms = ["MANAGE_CHANNELS", "MANAGE_GUILD"]
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
    let afterArgs = message.content;
    afterArgs = afterArgs.match(/^.topic (.+)/)[1]
    console.log(afterArgs)
    message.channel.setTopic(afterArgs, this.name).then(() => {
      message.channel.send(`**${message.author.tag}** set the channel topic: "${afterArgs}"`)
      message.delete()
    })
  }
}

module.exports = TopicCommand