const { Console, time } = require("console");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs")
const path = require("path")
const hook = require('./bot/lib/HookMan')

const times = {}

times.start = process.uptime()
console.log("Reading token and light config")
const token = fs.readFileSync("token.env", "utf-8")
var config = fs.readFileSync("config.json", "utf-8")
config = JSON.parse(config);
times.tokenLoaded = process.uptime()

times.startModules = process.uptime()
console.groupCollapsed("Loading modules")

// module namespace
const mod = {}

// load list of files in modules folder
var dirModules = fs.readdirSync("./bot/modules/")
console.log(dirModules.length + " modules found")

// loop through them and require() them
for (let i in dirModules) {
  console.groupCollapsed("Loading module " + (parseInt(i)+1) + " (" + dirModules[i] + ")")
  
  let thisName = dirModules[i].split('.js')[0];
  let modPath = "./bot/modules/" + thisName;
  let loadFrom = fs.readFileSync("./bot/modules/" + dirModules[i], 'utf-8')
  console.log("Checking if module is disabled")
  if (loadFrom.match(/^\/\/\s*(-[a-z]+)*\s*-disable(\s*(-[a-z]+)*)*/)) {
    console.groupEnd()
    console.warn(`Module ${thisName} is disabled`)
    continue
  }
  let commandClass = require(modPath)
  mod[thisName] = new commandClass(client)
  //mod[thisName].init()
  console.groupEnd()
}
console.groupEnd()
console.log("Done loading modules")
times.modulesLoaded = process.uptime()
console.groupCollapsed("Initializing modules")
for (let i in mod) {
  console.log(`Initializing ${mod[i].name}`)
  mod[i].init()
}
times.modulesInit = process.uptime()
console.groupEnd()
console.log("Modules initialized")
//Events

client.on('ready', () => {
  hook.fireEvent('ready')
  console.log("Client Ready")
})

client.on('message', (message) => {
  hook.fireEvent('message', message)
})



//log into bot
console.log("Logging into bot")
times.loginStart = process.uptime()
client.login(token).then(() => {
  times.loggedIn = process.uptime()
  console.group("Process times")
  console.log(`Token and light config load: ${(times.tokenLoaded - times.start)*1000}ms`)
  console.log(`Module load: ${(times.modulesLoaded - times.startModules)*1000}ms`)
  console.log(`Module init: ${(times.modulesInit - times.modulesLoaded)*1000}ms`)
  console.log(`Login: ${(times.loggedIn - times.loginStart)*1000}ms`)
  console.log(`Start to login: ${(times.loggedIn - times.start)*1000}ms`)
  console.groupEnd()
})