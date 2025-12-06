const db = require("./db.js");

function getLogChannel(moduleName, guildID)
{
       const row = db.prepare(`
            SELECT channelID FROM logChannels
            WHERE guildID = ? AND moduleName = ?
            LIMIT 1
        `).get(guildID, moduleName);
        return row  ? row.channelID : null
}

function isLogChannel(channelID, moduleName, guildID)
{
       return getLogChannel(moduleName, guildID) === channelID;
}

function setLogChannel(channelID, moduleName, guildID)
{
    db.prepare(`INSERT INTO logChannels (channelID, moduleName, guildID) 
                VALUES (?, ?, ?) 
                ON CONFLICT (guildID, moduleName)
                DO UPDATE SET channelID = excluded.channelID;`
            ).run(channelID, moduleName, guildID)
}


function unsetLogChannel(moduleName, guildID) {
    const channelId = getLogChannel(moduleName, guildID);
    db.prepare(`
        DELETE FROM logChannels
        WHERE channelID = ? AND moduleName = ? AND guildID = ?
    `).run(channelId, moduleName, guildID);
}
module.exports = {isLogChannel, getLogChannel, setLogChannel,  unsetLogChannel}