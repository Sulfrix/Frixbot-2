const { DiscordAPIError } = require("discord.js");

class Hook {
  /**
   * A hook for modules, fires a callback upon an event. Function arguments differ.
   * @param {import("discord.js").ClientEvents} event 
   * @param {Function} callback 
   */
  constructor(event, callback, source) {
    this.event = event
    this.callback = callback
    this.source = source
  }

  fire() {
    this.source[this.callback](...arguments)
  }
}

module.exports = Hook;