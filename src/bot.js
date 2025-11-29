const path = require("path");
const { GatewayIntentBits, Partials } = require( "discord.js");
const config = require("../config/config.json");
const BotClient = require("./BotClient.js");
global.APP_ROOT = path.join(__dirname, "..");
const db = require("./core/db.js");
require("dotenv").config();
function getIntents(intentNames)
{
    return intentNames.map(name=> GatewayIntentBits[name]);
}

function getPartials(partialNames)
{
    return partialNames.map(name=> Partials[name]);
}


const client = new BotClient({
    intents : getIntents(config.intents),
    partials : getPartials(config.partials)
});

client.start();

