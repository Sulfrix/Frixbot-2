const hook = require("./HookMan")

class Module {
  /**
   * Base class for modules. Should be extended.
   * Do not put any code in constructor that utilizes other modules. You can get the module ready for use by other modules.
   * @param {String} name The pretty name of the module.
   * @param {String} id The slightly less pretty "name" of the module. Don't put spaces.
   * @param {String} desc A pretty description of the module.
   */
  constructor(name, id, desc, client) {
    this.name = name
    this.id = id
    this.desc = desc
    this.client = client
    console.log("Module Init: " + this.id + " (" + this.name + ")")
  }
  /**
   * Put initial code here. You can use other modules in here.
   * @override 
   */
  init() {
    throw new Error(`Module Error: ${this.id} has not overridden the init() function.`)
  }

  hookCreate(event, callback) {
    hook.create(event, callback, this)
  }
}

module.exports = Module