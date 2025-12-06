const { getLogChannel } = require("@core/logConfig");
const EventEmitter = require("events");
const logEmitter = new EventEmitter();
async function sendLogMessage(author, guildId, moduleName, options = {})
{   const channelId = getLogChannel(moduleName, guildId)
    const  {
        content = "",
        customEmbeds = [],
        files = [],
    } = typeof options === "string" ? {content : options} : options
    if(!channelId)
        return console.warn(`Log channel not configured for ${moduleName}`);
    logEmitter.emit("moduleLog",
        {
            author,
            channelId,
            content,
            customEmbeds,
            moduleName,
            files,
            guildId,
        });

}

module.exports = {sendLogMessage, logEmitter }