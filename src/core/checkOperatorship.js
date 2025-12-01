const path = require("path");
const db = require("@db");
const {PermissionFlagsBits} = require("discord.js");
function checkOperatorship(member, guildID){
    if(member.guild.ownerId == member.id)
        return true;
    if(member.permissions.has(PermissionFlagsBits.Administrator))
        return true;

    return false;
}

module.exports = {checkOperatorship};