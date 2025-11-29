const path = require("path");
const db = require(path.join(APP_ROOT, "src/modules/shared/db.js"));
const {PermissionFlagsBits} = require("discord.js");
function checkOperatorship(member, guildID){
    if(member.guild.ownerId == member.id)
        return true;
    if(member.permissions.has(PermissionFlagsBits.Administrator))
        return true;
    const roles = member.roles.cache;
    const opRoles = db.prepare("SELECT roleID FROM operators WHERE guildID = ?").all(guildID)
    const hasOperatorRole = roles.some(role => opRoles.some(opRole => opRole.roleID === role.id));
    return hasOperatorRole;
}
function addOperatorRole(guildID, roleID){
    db.prepare("INSERT OR IGNORE INTO operators (guildID, roleID) VALUES (?, ?)").run(guildID, roleID);
}
function removeOperatorRole(guildID, roleID){
    db.prepare("DELETE FROM operators WHERE guildID = ? AND roleID = ?").run(guildID, roleID);
}
module.exports = {checkOperatorship, addOperatorRole, removeOperatorRole};