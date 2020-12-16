const { Message, MessageEmbed } = require("discord.js");
const Command = require("../lib/Command");

class PingCommand extends Command {
	constructor(owner) {
		super("Help Command", ["help"], owner);
		this.desc = "Shows help about a command. If no command is specified, shows list of commands.";
		this.usage = "help [command]\n [command] - (optional) The command to get help on. Leave blank for a list of commands.";
		this.obtainAvatar("205036941874429953");
	}

	obtainAvatar(id) {
		this.owner.client.users
			.fetch(id)
			.then((user) => {
				this.userAvatar = user.avatarURL();
			})
			.catch((err) => {
				if (err) {
					console.log("Owner Avatar URL retrival failed");
				}
			});
	}

	init() {}
	/**
	 * @param {Message} message
	 */
	invoke(message, args) {
		if (!this.userAvatar) this.obtainAvatar("205036941874429953");
		if (args[1]) {
			let resolvedAlias = this.owner.resolveAlias(args[1]);
			if (!resolvedAlias) {
				message.channel.send("Error: this command does not exist.");
				return false;
			}
			/**
			 * @type {Command}
			 */
			let resolvedCommand = resolvedAlias.command;
			const helpEmbed = new MessageEmbed()
				.setTitle(`${resolvedCommand.name}`)
				.setAuthor("Frixbot 2 | Help", this.owner.client.user.avatarURL())
				.setFooter("By Sulfrix#7440", this.userAvatar)
				.setDescription(`${resolvedCommand.desc}`)
				.addField("Usage", `\`\`\`${require("../lib/Prefix").get(message.guild)}${resolvedCommand.usage}\`\`\``, false)
				if (resolvedCommand.aliases.length > 1) {
					let aliasNames = [];
					for (let i of resolvedCommand.aliases) {
						aliasNames.push(`\`${i.name}\``);
					}
					helpEmbed.addField("Aliases", aliasNames.join(`\n`), true);
				}
			helpEmbed.addField("Required Permissions", `${resolvedCommand.perms.map((x) => `\`${x}\``).join(`\n`)}`, true);
			if (!resolvedCommand.dmAllowed) {
				helpEmbed.addField("Note", "This command cannot be used in DMs.", false)
			}
			message.channel.send(helpEmbed);
		} else {
			let commandNames = [];
			for (let i in this.owner.cmds) {
				if (this.owner.cmds[i].hasPerms(message.member)) {
					commandNames.push(`\`${this.owner.cmds[i].aliases.map((x) => x.name).join(", ")}\``);
				}
			}
			const helpEmbed = new MessageEmbed().setTitle(`Commands`).setAuthor("Frixbot 2 | Help", this.owner.client.user.avatarURL()).setFooter("By Sulfrix#7440", this.userAvatar).setDescription(`A list of all available commands. Aliases are shown, split by commas.`).addField("Commands", commandNames.join(`\n`, true));
			message.channel.send(helpEmbed);
		}
	}
}

module.exports = PingCommand;
