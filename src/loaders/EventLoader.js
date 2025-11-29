const fs = require("fs");
const path = require("path");

module.exports = (client) =>
{
    const eventsPath = path.join(__dirname, "../events");
    const files = fs.readdirSync(eventsPath);
    for(const file of files)
    {   if(!file.endsWith(".js"))
	    continue;
	const eventFunc = require(path.join(eventsPath, file));
	const eventName = file.split(".")[0];
	client.on(eventName, (...args) => eventFunc.execute(client, ...args));
    }
};
