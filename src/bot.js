require("module-alias/register");
const path = require("path");
const { GatewayIntentBits, Partials } = require( "discord.js");
const config = require("../config/config.json");
const BotClient = require("./BotClient.js");
const db = require("@db");
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

