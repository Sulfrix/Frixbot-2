// -requires:HookModule
const { MessageReaction, User, Client, TextChannel, Channel } = require("discord.js");
const Module = require("../lib/Module");

class HydraSpyModule extends Module {
	constructor() {
		super("Hydra Spy Module", "HydraSpyModule", "Spies on the #hydra-song-requests channel and logs who last used a reaction in that channel");
	}

	init() {
		require("../lib/ModMan").modules.HookModule.create("ready", "ready", this);
		require("../lib/ModMan").modules.HookModule.create("messageReactionAdd", "reaction", this);
	}

	ready() {
		/**
		 * @type {Client}
		 */
		let client = require.main.exports.client;
		client.channels.cache.forEach((cache) => {
      /**
       * @type {TextChannel}
       */
			let i = cache
			if (i.name != "hydra-song-requests") {
				return;
			}
      console.log(`Hydra Spy: '${i.name}' from '${i.guild.name}' is a Hydra channel, caching the reaction message`);
			i.messages.fetch({ limit: 10 }).then((messages) => {
        let message = messages.first()
				i.messages.cache.get(message.id);
			});
		});
	}

	/**
	 *
	 * @param {MessageReaction} messageReaction
	 * @param {User} user
	 */
	reaction(messageReaction, user) {
		if (messageReaction.message.channel.name == "hydra-song-requests") {
			messageReaction.message.channel.send(`Hydra action: ${messageReaction.emoji} from ${user.username}`).then((message) => {
        setTimeout(function () {
          if (!message.deleted) {
            message.delete()
          }
        }, 10000)
      })
		}
	}
}

module.exports = HydraSpyModule;
