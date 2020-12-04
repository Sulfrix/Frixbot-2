// -requires:HookModule
const Module = require("../lib/Module")
const fs = require('fs')
const path = require('path')
const { Message } = require("discord.js")
const { modules } = require("../lib/ModMan")

//const hook = require("../lib/HookMan")

class CommandModule extends Module {
  constructor() {
    super("Command Module", "CommandModule", "Handles commands within the bot.")
    this.classes = {}
    this.cmds = {}
    this.aliases = {}
    console.groupCollapsed("Loading commands")
    var commandDir = fs.readdirSync("./bot/commands/")
    console.log(commandDir.length + " commands found")
    for (let i in commandDir) {
      // TODO: Check for command validity before loading
      let thisName = commandDir[i].split('.js')[0];
      console.group("Loading command " + thisName);
      this.classes[thisName] = require(path.join("../commands/", commandDir[i]))
      console.groupEnd()
    }
    console.groupEnd()
  }
  
  init() {
    console.groupCollapsed("Instancing commands");
    for (let i in this.classes) {
      console.group("Instancing command " + i)
      this.cmds[i] = new this.classes[i](this);
      let cmd = this.cmds[i]
      for (let a of cmd.aliases) {
        this.aliases[a.name] = a;
      }
      console.groupEnd();
    }
    console.groupEnd();
    if (require("../lib/ModMan").modules.HookModule) {
      require("../lib/ModMan").modules.HookModule.create("message", "messageRecieved", this);
    } else {
      console.warn("Command Module: Hook Module not found. Module is inoperrable without it!");
    }
  }
  /**
   * Invokes a message.
   * @param {Message} message 
   */
  messageRecieved(message) {
    if (message.content.startsWith(require('../lib/Prefix').get(message.guild))) {
      var messageArgs = message.content.substr(1)
      messageArgs = messageArgs.split(" ")
      if (this.resolveAlias(messageArgs[0])) {
        if (this.resolveAlias(messageArgs[0]).command.hasPerms(message.member)) {
          this.resolveAlias(messageArgs[0]).command.invoke(message, messageArgs)
        } else {
          message.channel.send(`Insufficient Permissions! \n**Required Permissions:**\`\`\`diff\n${this.resolveAlias(messageArgs[0]).command.perms.map((x) => { return (this.resolveAlias(messageArgs[0]).command.checkPerm(message.member, x) ? "+ " : "- ") + x}).join('\n')}\`\`\``)
        }
      }
    }
  }

  resolveAlias(string) {
    if (this.aliases[string]) {
      return this.aliases[string]
    } else {
      return undefined
    }
  }
  
}

module.exports = CommandModule;