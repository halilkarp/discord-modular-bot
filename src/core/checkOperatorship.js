const path = require("path");
const db = require("@db");
const {PermissionFlagsBits} = require("discord.js");
function checkOperatorship(member, guildID, moduleName){
    if(member.guild.ownerId == member.id)
        return true;
    if(member.permissions.has(PermissionFlagsBits.Administrator))
        return true;
    const hasOperatorRole = member.roles.cache.some(role =>  db.prepare(`
            SELECT 1 FROM moduleOperators
            WHERE roleID = ? AND guildID = ? AND moduleName = ?
            LIMIT 1
        `).get(role.id, guildID, moduleName) !== undefined
    );

    return hasOperatorRole;
}

module.exports = {checkOperatorship};