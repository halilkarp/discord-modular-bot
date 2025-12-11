const db = require("@db");


function keywordExists(keyword, guildID)
{
    return db.prepare("SELECT 1 FROM reactions WHERE keyword = ? AND guildID = ?").get(keyword, guildID) !== undefined;
}


function emojiExists(emoji, guildID)
{
    return db.prepare("SELECT 1 FROM reactions WHERE emoji = ? AND guildID = ?").get(emoji, guildID) !== undefined;

}
function guildHasReaction(guildID)
{
    return db.prepare("SELECT 1 FROM reactions WHERE guildID = ?").get(guildID) !== undefined;

}


module.exports = {keywordExists, emojiExists, guildHasReaction}