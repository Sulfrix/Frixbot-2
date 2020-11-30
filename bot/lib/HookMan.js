var Hook = require('./Hook')

var hook = {}
hook.hooks = {}

/**
 * 
 * @param {import('discord.js').ClientEvents} event 
 * @param {Function} callback 
 */
hook.create = function(event, callback, source) {
  console.log(`Hook created to event '${event}'`)
  let out = new Hook(event, callback, source)
  if (!hook.hooks[event]) {
    hook.hooks[event] = []
  }
  hook.hooks[event].push(out)
}
hook.destroy = function(event, callback) {
  if (!hook.hooks[event]) {
    return false
  }
  for (let i of hook.hooks[event]) {
    if (i.callback == callback) {
      hook.hooks[event].splice(hook.hooks[event].indexOf(i), 1)
      return true
    }
  }
  return false
}

hook.fireEvent = function(event, ...args) {
  if (!hook.hooks[event]) {
    hook.hooks[event] = []
  }
  for (let i of hook.hooks[event]) {
    i.fire(...args)
  }
}

module.exports = hook