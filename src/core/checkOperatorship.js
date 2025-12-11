const path = require("path");
const db = require("@db");
const {PermissionFlagsBits} = require("discord.js");
const {isOperator}= require("./operatorConfig.js")
function checkOperatorship(member, guildID, moduleName){
    if(member.guild.ownerId == member.id)
        return true;
    if(member.permissions.has(PermissionFlagsBits.Administrator))
        return true; 
     return member.roles.cache.some(role =>  
            isOperator(role.id, moduleName, guildID)
    );


}

module.exports = {checkOperatorship};