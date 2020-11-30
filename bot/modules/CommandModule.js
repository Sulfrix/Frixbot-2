const Module = require("../lib/Module")
const fs = require('fs')
const path = require('path')
const { Message } = require("discord.js")
const hook = require("../lib/HookMan")
//const hook = require("../lib/HookMan")

class CommandModule extends Module {
  constructor(client) {
    super("Command Module", "CommandModule", "Handles commands within the bot.", client)
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
    this.hookCreate("message", "messageRecieved")
  }
  /**
   * Invokes a message.
   * @param {Message} message 
   */
  messageRecieved(message) {
    if (message.content.startsWith(require('../lib/Prefix'))) {
      var messageArgs = message.content.substr(1)
      messageArgs = messageArgs.split(" ")
      if (this.resolveAlias(messageArgs[0])) {
        this.resolveAlias(messageArgs[0]).command.invoke(message, messageArgs)
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