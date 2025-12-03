const logconfig = require("@core/logConfig")
const {checkOperatorship} = require ("@core/checkOperatorship.js");
const {SlashCommandBuilder} = require("discord.js");
const {moduleNames} = require("@modules")
const addLogChannel = {
    name : "logchannel",
    description : "Set/unset a log channel for a module",
    data : new SlashCommandBuilder().setName("logchannel").setDescription("Set/unset the log channel for a given module").
    addSubcommand(sub=>
    sub.setName("set").setDescription("Set log channel")
    .addStringOption(option => option.setName("module").setDescription("module")
.setChoices(moduleNames.map(m => ({name : m, value: m}))).setRequired(true)).
addChannelOption(option=> option.setName("channel").setDescription("channel(required for set)").setRequired(true))
).    addSubcommand(sub=>
    sub.setName("unset").setDescription("Unset log channel")
    .addStringOption(option => option.setName("module").setDescription("module")
.setChoices(moduleNames.map(m => ({name : m, value: m}))).setRequired(true)))
,



async execute(client, interaction)
{
    await interaction.deferReply({ ephemeral: true });
    if(!checkOperatorship(interaction.member, interaction.guildId)){
        await interaction.editReply({content: "You are not authorized to use this command."});
        return;
    }
    const action = interaction.options.getSubcommand();
    if(action === "set")
    {
        const moduleName = interaction.options.getString("module");
        if(!moduleName)
        {
            await interaction.editReply({content: "Invalid module"});
            return;
        }
        const hasLogchannel = logconfig.getLogChannel(moduleName, interaction.guildId);
        if(hasLogchannel!== null)
        {
             await interaction.editReply({content: `The ${moduleName} module already has the ${client.channels.fetch(hasLogchannel)} as the log channel.`});
            return;
        }        
        const channel = interaction.options.getChannel("channel");
        if(!channel)
        {
            await interaction.editReply({content: "Invalid channel"});
            return;
        }
            logconfig.setLogChannel(channel.id, moduleName, interaction.guildId);
            await interaction.editReply({content: `<#${channel.id}> has been set as the log channel for the ${moduleName} module`});

    }
     if(action === "unset")
    {
        const moduleName = interaction.options.getString("module");
        if(!moduleName)
        {
            await interaction.editReply({content: "Invalid module"});
            return;
        }
        const hasLogchannel = logconfig.getLogChannel(moduleName, interaction.guildId) === null;
        if(hasLogchannel)
        {
             await interaction.editReply({content: `The ${moduleName} module already doesn't have a log channel`})
            return;
        }        

            logconfig.unsetLogChannel(moduleName, interaction.guildId);
            await interaction.editReply({content: `The ${moduleName} module no longer has a log channel.`});

    }

}

}


   

module.exports = { addLogChannel}