const { Message } = require("discord.js")
const Alias = require("./Alias")
const CommandModule = require("../modules/CommandModule")

class Command {
  constructor(name, aliases, owner) {
    this.name = name
    this.aliases = []
    /**
     * @type {CommandModule}
     */
    this.owner = owner
    console.group("Assigning aliases")
    for (let i of aliases) {
      if (typeof i == "string") {
        console.log(`Aliasing ${i}`)
        this.aliases.push(new Alias(i, this))
      } else {
        console.log(`Aliasing a predefined alias`)
        this.aliases.push(i)
      }
    }
    console.groupEnd();
  }

  init() {
    throw new Error(`Command Error: ${this.constructor.name} has not overridden the init() function.`)
  }
  /**
   * Invokes the command with a message object.
   * @param {Message} message 
   */
  invoke(message) {
    throw new Error(`Command Error: ${this.constructor.name} has not overridden the invoke() function.`)
  }
}

module.exports = Command;