const db = require("./db.js");

function isOperator(roleID, moduleName, guildID)
{
    const row = db.prepare(`
            SELECT * FROM moduleOperators
            WHERE roleID = ? AND guildID = ? AND moduleName = ?
            LIMIT 1
        `).get(roleID, guildID, moduleName);
        return row !== null;
}

function getOperators(moduleName, guildID)
{
       const row = db.prepare(`
            SELECT roleID FROM moduleOperators
            WHERE guildID = ? AND moduleName = ?
        `).get(guildID, moduleName);
        return row  ? row.channel : null
}

function addOperator(roleID, moduleName, guildID)
{
    db.prepare(`INSERT INTO moduleOperators (roleID, moduleName, guildID) 
                VALUES (?, ?, ?)`
            ).run(roleID, moduleName, guildID)
}

function removeOperator(roleID, moduleName, guildID) {
    db.prepare(`
        DELETE FROM moduleOperators
        WHERE roleID = ? AND moduleName = ? AND guildID = ?
    `).run(roleID, moduleName, guildID);
}
module.exports = {isOperator, getOperators, addOperator, removeOperator}