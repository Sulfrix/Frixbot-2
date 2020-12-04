const { Console, time } = require("console");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs")
const path = require("path")

const times = require("./bot/lib/times")

times.start = process.uptime()
console.log("Reading token and light config")
const token = fs.readFileSync("token.env", "utf-8")
var config = fs.readFileSync("config.json", "utf-8")
config = JSON.parse(config);
times.tokenLoaded = process.uptime()


const modman = require("./bot/lib/ModMan")

module.exports = {
  client: client,
  modman: modman,
  config: config
}

modman.start()


client.on("ready", () => {
  console.log("Logged In")
})

client.on("error", (err) => {
  if (client.uptime > 0) {
    client.users.fetch("205036941874429953").then((usr) => {
      usr.send("Error! ```" + err.message + "```")
    })
  }
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

