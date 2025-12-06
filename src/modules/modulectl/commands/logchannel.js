const logger = require("@core/logger.js")
const {checkOperatorship} = require ("@core/checkOperatorship.js");
const {SlashCommandBuilder} = require("discord.js");
const {modules} = require("@modules")
const {  MODULE_SETTING, access, rules} = require("../index")
const moduleNames = modules.filter(m=> m.needsLogging);
const addLogChannel = {
    name : "logchannel",
    description : "Set/unset a log channel for a module",
    data : new SlashCommandBuilder().setName("logchannel").setDescription("Set/unset the log channel for a given module").
    addSubcommand(sub=>
    sub.setName("set").setDescription("Set log channel")
    .addStringOption(option => option.setName("module").setDescription("module")
.setChoices(moduleNames.map(m => ({name : m.name, value: m.name}))).setRequired(true)).
addChannelOption(option=> option.setName("channel").setDescription("channel(required for set)").setRequired(true))
).    addSubcommand(sub=>
    sub.setName("unset").setDescription("Unset log channel")
    .addStringOption(option => option.setName("module").setDescription("module")
.setChoices(moduleNames.map(m => ({name : m.name, value: m.name}))).setRequired(true)))
,



async execute(client, interaction)
{
    await interaction.deferReply({ ephemeral: true });
    if(!checkOperatorship(interaction.member, interaction.guildId)){
        await interaction.editReply({content: "You are not authorized to use this command."});2
        return;
    }
     const moduleName = interaction.options.getString("module");
        if(!moduleName)
        {
            await interaction.editReply({content: "Invalid module"});
            return;
        }
    const action = interaction.options.getSubcommand();
    const hasLogchannel = rules.isNotEmpty(moduleName,interaction.guildId, MODULE_SETTING.LOG_CHANNELS)
    const channel = interaction.options.getChannel("channel");
    let logMessage = ``

    if(action === "set")
    {
        
        if(hasLogchannel)
        {
             await interaction.editReply({content: `The ${moduleName} module already has a log channel.`});
            return;
        }        
        if(!channel)
        {
            await interaction.editReply({content: "Invalid channel"});
            return;
        }
            access.add(channel.id, moduleName, interaction.guildId, MODULE_SETTING.LOG_CHANNELS);
            logMessage = `<#${channel.id}> has been set as the log channel for the ${moduleName} module`
            await interaction.editReply({content: logMessage });
            logger.sendLogMessage(interaction.user, interaction.guildId, "modulectl",logMessage)


    }
     if(action === "unset")
    {
        if(hasLogchannel === null)
        {
             await interaction.editReply({content: `The ${moduleName} module already doesn't have a log channel`})
            return;
        }  
                logMessage = `The ${moduleName} module no longer has a log channel.`

            logger.sendLogMessage(interaction.user, interaction.guildId, "modulectl",logMessage)      
            access.remove( moduleName, interaction.guildId, MODULE_SETTING.LOG_CHANNELS);
            await interaction.editReply({content: logMessage });

    }


}

}


   

module.exports = { addLogChannel}