const {SlashCommandBuilder, MessageFlags} = require("discord.js");
const path = require("path");
const {checkOperatorship} = require ("../auth/checkOperatorship.js");
const db = require("@db");
async function getTarget(interaction)
{

        if(!checkOperatorship(interaction.member, interaction.guildId)){
            await interaction.editReply({content: "You are not authorized to use this command."});
            return null;
        }
         const target = interaction.options.getUser("username");
        if(!target){
            await interaction.editReply({content: "Invalid user specified."});
            return null;
        }
            return target;    
}
async function checkIfUserExists(userID, guildID,table)
{
    const entry = db.prepare(`SELECT 1 FROM ${table} WHERE userID = ? AND guildID = ? LIMIT 1;`).get(userID, guildID);
    return entry !== undefined;
}
const restoreaccess = {
    name : "restoreaccess",
    description : "Restore access to the impersonation command",
    data : new SlashCommandBuilder().setName("restoreaccess").setDescription("Restore the impersonation access").
    addUserOption(option => option.setName("username").setDescription("username").setRequired(true)),
    async execute(client, interaction)
    {
        await interaction.deferReply({ephemeral: true});
        const target = await getTarget(interaction)
       if(!target){
        await interaction.editReply({content: "Invalid user specified."});
            return;
       }
        if(!await checkIfUserExists( target.id, interaction.guildId,"deniedUsers")){
            await interaction.editReply({content: `<@${target.id}> already has impersonation access.`});
            return;
        }
        //Remove the user from the deniedUsers table
        db.prepare("DELETE FROM deniedUsers WHERE userID = ? AND guildID = ?").run(target.id, interaction.guildId);
        await interaction.editReply({content: `Successfully restored impersonation access for <@${target.id}>.`});

    }
}
const revokeaccess = {
    name : "revokeaccess",
    description : "Revoke access to the impersonation command",
    data : new SlashCommandBuilder().setName("revokeaccess").setDescription("Revoke the impersonation access").
    addUserOption(option => option.setName("username").setDescription("username").setRequired(true)),
    async execute(client, interaction)
    {
        await interaction.deferReply({ephemeral: true});
        const target = await getTarget(interaction)
       if(!target){
                await interaction.editReply({content: "Invalid user specified."});

            return;
       }
       if(await checkIfUserExists( target.id, interaction.guildId,"deniedUsers")){
        await interaction.editReply({content: `<@${target.id}> already has impersonation access revoked.`});
        return;
       }
        //Add the user to the deniedUsers table
        db.prepare("INSERT OR IGNORE INTO deniedUsers (userID, guildID) VALUES (?, ?)").run(target.id, interaction.guildId);
        await interaction.editReply({content: `Successfully revoked impersonation access for <@${target.id}>.`});

    }
} 
module.exports = {restoreaccess, revokeaccess};