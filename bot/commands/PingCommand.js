const { Message } = require('discord.js')
var Command = require('../lib/Command')

class PingCommand extends Command {
  constructor(owner) {
    super("Ping Command", ["ping", "delay"], owner)
    this.desc = "Sends a message to the channel with the time it took between you sending the message and the bot sending one back."
    this.usage = "ping"
  }

  init() {}
  /**
   * 
   * @param {Message} message 
   */
  invoke(message) {
    let firstTimecode = message.createdTimestamp;
    message.channel.send("Pong!").then((newMsg) => {
      let lastTimecode = newMsg.createdTimestamp;
      let timeDiff = lastTimecode - firstTimecode;
      newMsg.edit("Pong! " + timeDiff + "ms");
    })
  }
}

module.exports = PingCommand