const  {Client, Collection} = require("discord.js");
const loadEvents = require("./loaders/EventLoader.js");
const loadCommands = require("./loaders/CommandLoader.js");

 class BotClient extends Client {

    constructor(config)
    {
	super({
	    intents: config.intents,
	    partials: config.partials,
	});
    
    this.config = config;
    this.commands = new Collection();
    this.cooldowns = new Map();
    }
    start(){
        loadEvents(this);
        loadCommands(this);
        this.login(process.env.BOT_TOKEN);
    }
}
module.exports = BotClient;
