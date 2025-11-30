const {SlashCommandBuilder, MessageFlags} = require("discord.js");
const impersonation = require ("@modules/impersonation");
const {checkOperatorship} = require ("@core/checkOperatorship.js");

const restoreaccess = {
    name : "restoreaccess",
    description : "Restore access to the impersonation command",
    data : new SlashCommandBuilder().setName("restoreaccess").setDescription("Restore the impersonation access").
    addUserOption(option => option.setName("username").setDescription("username").setRequired(true)),
    async execute(client, interaction)
    {
        await interaction.deferReply({ ephemeral: true });
        if(!checkOperatorship(interaction.member, interaction.guildId)){
            await interaction.editReply({content: "You are not authorized to use this command."});
            return;
        }
        const targetUser = interaction.options.getUser("username");
        if(!targetUser){
            await interaction.editReply({content: "User not found."});
            return;
        }
        if(! await impersonation.access.userExists(targetUser.id, interaction.guildId)){
            await interaction.editReply({content: "User already has access."});
            return;
        }
        await impersonation.access.restore(targetUser.id, interaction.guildId);
        await interaction.editReply({content: `Restored access for ${targetUser.tag}.`});    
    }
}
const revokeaccess = {
    name : "revokeaccess",
    description : "Revoke access to the impersonation command",
    data : new SlashCommandBuilder().setName("revokeaccess").setDescription("Revoke the impersonation access").
    addUserOption(option => option.setName("username").setDescription("username").setRequired(true)),
    async execute(client, interaction)
    {
        await interaction.deferReply({ ephemeral: true });
        if(!checkOperatorship(interaction.member, interaction.guildId)){
            await interaction.editReply({content: "You are not authorized to use this command."});
            return;
        }
        const targetUser = interaction.options.getUser("username");
        if(!targetUser){
            await interaction.editReply({content: "User not found."});
            return;
        }
        if( await impersonation.access.userExists(targetUser.id, interaction.guildId)){
            await interaction.editReply({content: "User already has no access."});
            return;
        }
        await impersonation.access.revoke(targetUser.id, interaction.guildId);
        await interaction.editReply({content: `Revoked access for ${targetUser.tag}.`});

    }
} 
module.exports = {restoreaccess, revokeaccess};