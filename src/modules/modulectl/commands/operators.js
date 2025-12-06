const logger = require("@core/logger.js")
const {checkOperatorship} = require ("@core/checkOperatorship.js");
const {SlashCommandBuilder} = require("discord.js");
const {modules} = require("@modules")
const {  MODULE_SETTING, access, rules} = require("../index")
const moduleNames = modules.filter(m=> m.needsOperator);

module.exports = {
    name : "operators",
    description : "Add/remove an operator for a module",
        data : new SlashCommandBuilder().setName("operator").setDescription("Add/remove an operator for a module").
        addStringOption(option=> option.setName("action").setDescription("action").setChoices(

            {name : "add", value : "add"},
            {name: "remove", value : "remove"}
        ).setRequired(true))
        .addStringOption(option => option.setName("module").setDescription("module")
.setChoices(moduleNames.map(m => ({name : m.name, value: m.name}))).setRequired(true)).
addRoleOption(option=> option.setName("role").setDescription("role").setRequired(true)),


async execute(client, interaction)
{
    await interaction.deferReply({ ephemeral: true });
    if(!checkOperatorship(interaction.member, interaction.guildId)){
        await interaction.editReply({content: "You are not authorized to use this command."});
        return;
    }

    const action = interaction.options.getString("action");
    const moduleName = interaction.options.getString("module");
    const role = interaction.options.getRole("role")
    const roleExists = rules.existsInTable(role.id, moduleName, interaction.guildId, MODULE_SETTING.OPERATORS)
    let logMessage = ``;
    if(action === "add")
    {
        if(roleExists)
        {
             await interaction.editReply({content: "This role already is an operator for the module"});
             return;

        }
        access.add(role.id, moduleName, interaction.guildId, MODULE_SETTING.OPERATORS);
        logMessage = `The role <@&${role.id}> has been set as an operator for the ${moduleName} module`
        

    }
    if(action === "remove")
    {
        if(!roleExists)
        {
             await interaction.editReply({content: "This role already isn't an operator for the module"});
             return;
        }
        logMessage = `The role <@&${role.id}> is no longer an operator for the ${moduleName} module`
        access.remove(role.id, moduleName, interaction.guildId, MODULE_SETTING.OPERATORS)
        

    }
    await interaction.editReply({content: logMessage});
    logger.sendLogMessage(interaction.user, interaction.guildId, "modulectl",logMessage)      
}


}