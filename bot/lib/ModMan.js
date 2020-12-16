const fs = require("fs");
const times = require("./times");
// module namespace
const modman = {};
modman.modules = {};
modman.dependencies = {};

modman.start = function () {
	times.startModules = process.uptime();
	console.group("Loading modules");

	// load list of files in modules folder
	var dirModules = fs.readdirSync("./bot/modules/");
	console.log(dirModules.length + " modules found");

	// loop through them and require() them
	for (let i in dirModules) {
		console.groupCollapsed("Loading module " + (parseInt(i) + 1) + " (" + dirModules[i] + ")");

		let thisName = dirModules[i].split(".js")[0];
		let modPath = "../modules/" + thisName;
		let loadFrom = fs.readFileSync("./bot/modules/" + dirModules[i], "utf-8");
		console.log("Checking if module is disabled");
		// Check if module has the -disabled flag
		if (loadFrom.match(/^\/\/\s*(-[a-zA-Z,;:/?]+)*\s*-disable(\s*(-[a-zA-Z,;:/?]+)*)*/)) {
			console.groupEnd();
			console.warn(`Module ${thisName} is disabled`);
			continue;
		}
		// Check if module has correct syntax for the -requires flag
		if (loadFrom.match(/^\/\/\s*(-[a-zA-Z,;:/?]+)*\s*-requires:([a-zA-Z]+,?)+(\s*(-[a-zA-Z,;:/?]+)*)*/g)) {
			// resolve dependecies of module, add to dependecies object
			let requireString = loadFrom.match(/(?<=^\/\/.+)-requires:([a-zA-Z]+,?)+/)[0];
			requireString = requireString.replace(/^-requires:/, "");
			let requiredModules = requireString.split(",");
			for (let i of requiredModules) {
				if (!modman.dependencies[i]) {
					let newDepend = {
						name: i,
						users: [],
					};
					modman.dependencies[i] = newDepend;
				}
				modman.dependencies[i].users.push(thisName);
			}
		}
		let commandClass = undefined;
		try {
			commandClass = require(modPath);
		} catch (err) {
			if (err) {
				console.groupEnd()
				let errString = `%c  Module Error  %c  Module ${thisName} could not be loaded.  `
				console.log(errString, "color: white; background: red", "color: red; background: white")
				let length = errString.replace('%c', '').length
				let extraString = `%c  Caused by ${err.name}`
				extraString = extraString + (' ').repeat(length-(extraString.replace('%c', '').length+2));
				console.log(extraString, "color: red; background: white")
				console.groupCollapsed(` Expand Details `)
				console.error(err)
				console.groupEnd()
				continue
			}
		}
		modman.modules[thisName] = new commandClass(require.main.client);
		//mod[thisName].init()
		console.groupEnd();
	}
	console.groupEnd();
	console.log("Done loading modules");
	times.modulesLoaded = process.uptime();
	console.groupCollapsed("Initializing modules");
	console.log("Checking module dependencies");
	let disabledByDepends = 0;
	for (let o in modman.dependencies) {
		let i = modman.dependencies[o];
		if (!modman.modules[i.name]) {
			console.error(`Module Error: ${i.name} does not exist or is disabled, and is needed by ${i.users.length} module${i.users.length == 1 ? "" : "s"} (${i.users.join(", ")})\nThe dependent module${i.users.length == 1 ? "" : "s"} ${i.users.length == 1 ? "has" : "have"} been disabled.`);
			for (let r of i.users) {
				delete modman.modules[r];
				disabledByDepends++;
			}
		}
	}

	for (let i in modman.modules) {
		console.log(`Initializing ${modman.modules[i].name}`);
		modman.modules[i].init();
	}
	times.modulesInit = process.uptime();
	console.groupEnd();
	console.log("Modules initialized");
	if (disabledByDepends > 0) {
		console.error(`${disabledByDepends} dependency error${disabledByDepends == 1 ? "" : "s"}. Expand 'Initializing modules' to see further details.`);
	}
};

module.exports = modman;
