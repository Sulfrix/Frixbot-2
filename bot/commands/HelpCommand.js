const { Message, MessageEmbed } = require("discord.js");
var Command = require("../lib/Command");

class PingCommand extends Command {
	constructor(owner) {
		super("Help Command", ["help"], owner);
		this.desc = "Shows help about a command. If no command is specified, shows list of commands.";
		this.usage = "help [command]";
	}

	init() {}
	/**
	 * @param {Message} message
	 */
	invoke(message, args) {
		if (args[1]) {
			let resolvedCommand = this.owner.resolveAlias(args[1]).command;
			if (!resolvedCommand) {
				message.channel.send("Error: this command does not exist.");
				return false;
			}
			const helpEmbed = new MessageEmbed()
        .setTitle(`${resolvedCommand.name}`)
        .setAuthor("Frixbot 2 | Help", this.owner.client.user.avatarURL())
        .setFooter("By Sulfrix#7440", "https://cdn.discordapp.com/avatars/205036941874429953/3299e40efb29c3f7f8f6574a592e8595.png?size=256")
				.setDescription(`${resolvedCommand.desc}`)
				.addField(
					"Usage",
					`\`\`\`${require("../lib/Prefix")}${resolvedCommand.usage}\`\`\``,
					true
        );
      if (resolvedCommand.aliases.length > 1) {
        let aliasNames = []
        for (let i of resolvedCommand.aliases) {
          aliasNames.push(`\`${i.name}\``)
        }
        helpEmbed.addField('Aliases', aliasNames.join(`\n`), false)
      }
			message.channel.send(helpEmbed);
		} else {
      let commandNames = []
      for (let i in this.owner.cmds) {
        commandNames.push(`\`${this.owner.cmds[i].aliases.map(x => x.name).join(", ")}\``)
      }
      const helpEmbed = new MessageEmbed()
        .setTitle(`Commands`)
        .setAuthor("Frixbot 2 | Help", this.owner.client.user.avatarURL())
        .setFooter("By Sulfrix#7440", "https://cdn.discordapp.com/avatars/205036941874429953/3299e40efb29c3f7f8f6574a592e8595.png?size=256")
				.setDescription(`A list of all available commands. Aliases are shown, split by commas.`)
        .addField("Commands", commandNames.join(`\n`, true));
      message.channel.send(helpEmbed);
    }
	}
}

module.exports = PingCommand;
