const { Message, User, GuildMember } = require("discord.js")
const CommandModule = require("../modules/CommandModule")
const Alias = require("./Alias")

class Command {
  /**
	 * Base class for modules. Should be extended.
	 * Do not put any code in constructor that utilizes other modules. You can get the module ready for use by other modules.
	 * @param {String} name The name of the command.
	 * @param {(String|Alias)[]} aliases An array of strings (or Alias objects) that will activate this command.
	 * @param {CommandModule} owner the CommandModule object.
	 */
  constructor(name, aliases, owner) {
    this.name = name
    this.aliases = []
    this.dmAllowed = true;
    /**
     * @type {CommandModule}
     */
    this.owner = owner
    /**
     * An array of the required permissions needed to execute the command.
     * 'BOT_OWNER' is also a permission.
     * @type {import("discord.js").PermissionString[]}
     */
    this.perms = ["SEND_MESSAGES"]
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
  /**
   * Called when command module is initialized and command is instanced.
   * 
   */
  init() {
    throw new Error(`Command Error: ${this.constructor.name} has not overridden the init() function.`)
  }
  /**
   * Invokes the command with a message object.
   * @param {Message} message 
   * @param {String[]} args
   */
  invoke(message, args) {
    throw new Error(`Command Error: ${this.constructor.name} has not overridden the invoke() function.`)
  }

  /**
   * 
   * @param {GuildMember} member
   */
  hasPerms(member) {
    let out = true;
    for (let i of this.perms) {
      if (!this.checkPerm(member, i)) {
        out = false;
        break;
      }
    }
    return out;
  }

  checkPerm(member, perm) {
    let i = perm
    let out = true;
    if (i == "BOT_OWNER") {
      if (!(require.main.exports.config.owner == member.user.id)) {
        out = false;
        return out;
      }
    }
    if (!member.permissions.has(i)) {
      out = false;
      return out;
    }
    return out
  }
}

module.exports = Command;