const Command = require("./Command")

class Alias {
  constructor(name, command) {
    this.name = name
    /**
     * @type {Command}
     */
    this.command = command
  }
}

module.exports = Alias