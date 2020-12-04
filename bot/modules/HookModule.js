const { Client } = require("discord.js");
var Hook = require("../lib/Hook");
const Module = require("../lib/Module");
/**
 * @type {Client}
 */
const client = require.main.exports.client

class HookModule extends Module {
	constructor() {
		super(
			"Hook Module",
			"HookModule",
			"Handles hooks within the bot. Very important."
		);
		this.hooks = {};
  }
  
  init() {
    client.on('ready', () => {
      this.fireEvent('ready')
    })
    
    client.on('message', (message) => {
      this.fireEvent('message', message)
		})
		
		client.on('messageReactionAdd', (messageReaction, user) => {
			this.fireEvent('messageReactionAdd', messageReaction, user)
		})
  }

	/**
	 *
	 * @param {import('discord.js').ClientEvents} event
	 * @param {Function} callback
	 */
	create(event, callback, source) {
		console.log(`Hook created to event '${event}'`);
		let out = new Hook(event, callback, source);
		if (!this.hooks[event]) {
			this.hooks[event] = [];
		}
		this.hooks[event].push(out);
	}
	destroy(event, callback) {
		if (!this.hooks[event]) {
			return false;
		}
		for (let i of this.hooks[event]) {
			if (i.callback == callback) {
				this.hooks[event].splice(this.hooks[event].indexOf(i), 1);
				return true;
			}
		}
		return false;
	}
	fireEvent(event, ...args) {
		if (!this.hooks[event]) {
			this.hooks[event] = [];
		}
		for (let i of this.hooks[event]) {
			i.fire(...args);
		}
	}
}

module.exports = HookModule;
