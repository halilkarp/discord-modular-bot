const db = require("@db");
async function userExists(userID, guildID)
{
    const entry = db.prepare(`SELECT 1 FROM deniedUsers WHERE userID = ? AND guildID = ? LIMIT 1;`).get(userID, guildID);
    return entry !== undefined;
}

async function revoke(userID, guildID){
        db.prepare("INSERT OR IGNORE INTO deniedUsers (userID, guildID) VALUES (?, ?)").run(userID, guildID);

}
async function restore(userID, guildID){
        db.prepare("DELETE FROM deniedUsers WHERE userID = ? AND guildID = ?").run(userID, guildID);

}
module.exports = {userExists, revoke, restore};