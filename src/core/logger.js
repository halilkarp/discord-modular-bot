const { getLogChannel } = require("@core/logConfig");

async function sendLogMessage(client, guildId, moduleName, message)
{   const channelId = getLogChannel(moduleName, guildId)
    if(!channelId)
        return console.warn(`Log channel not configured for ${moduleName}`);
    const channel = await client.channels.fetch(channelId).catch(() => null);
    if(!channel)
    {
          console.warn(`Failed to get log channel ${channelId}`);
        return;
    }
    await channel.send(message);
}

module.exports = {sendLogMessage }