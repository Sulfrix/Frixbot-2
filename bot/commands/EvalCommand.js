const { Message } = require('discord.js');
var Command = require('../lib/Command')
const vm = require('vm')


class EvalCommand extends Command {
  constructor(owner) {
    super("Evaluate Command", ["eval"], owner)
    this.desc = "Runs JavaScript. Might not be available to normal users\nThe codeblock can have `js` syntax formatting on it.\nSetting the var `out` inside the code will be sent to you when code is executed.";
    this.usage = "eval <js code block>";
    this.perms = ["BOT_OWNER"]
  }

  init() {

  }
  /**
   * 
   * @param {Message} message 
   * @param {String[]} args 
   */
  invoke(message, args) {
    let match = message.content.match(/.+(\s|\s?\n\s?)```(js\n|\n)?((.|\n)+)\n?```/)
    if (!match) {
      message.channel.send("Invalid syntax! A codeblock (` \`\`\`code\`\`\` `) is required.")
    }
    var context = { message: message, commandModule: this.owner };
    vm.createContext(context)
    try {
      vm.runInContext(match[3], context, {timeout: 50})
    } catch (err) {
      if (err) {
        message.channel.send(`\`\`\`${err.message}\`\`\``)
        return
      }
    }

    if (context.out) {
      message.channel.send(`${context.out}`)
    }
  }
}

module.exports = EvalCommand