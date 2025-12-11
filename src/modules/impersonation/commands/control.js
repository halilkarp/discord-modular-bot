const {SlashCommandBuilder} = require("discord.js");
const {access,rules, POLICY, ACTIONS} = require ("@modules/impersonation");
const {checkOperatorship} = require ("@core/checkOperatorship.js");
const logger = require("@core/logger.js")

module.exports = {
    name : "impctl",
    description : "Control access to the impersonation command and who can't be impersonated",
    data : new SlashCommandBuilder().setName("impctl").setDescription("Control access to the impersonation command and who can't be impersonated").
    addStringOption(option => option.setName("action").setDescription("action").setRequired(true).
        setChoices(Object.values(ACTIONS).map(p=> ({name : p.toLowerCase(), value : p})))).
    addStringOption(option => option.setName("policy").setDescription("policy").setRequired(true).
        setChoices(Object.values(POLICY).map(p=> ({name : p.toLowerCase(), value : p})))).

    addUserOption(option=> option.setName("username").setDescription("username").setRequired(true)),
   
    async execute(client, interaction)
    {
        await interaction.deferReply({ ephemeral: true });
        if(!checkOperatorship(interaction.member, interaction.guildId, "impersonation")){
            await interaction.editReply({content: "You are not authorized to use this command."});
            return;
        }
        const targetUser = interaction.options.getUser("username");
        if(!targetUser){
            await interaction.editReply({content: "User not found."});
            return;
        }

        const action = interaction.options.getString("action");
        const policy = interaction.options.getString("policy");
        let logMessage = "";
        if(action === ACTIONS.add)
        {
            if(await rules.hasPolicy(targetUser.id, interaction.guildId, policy)){
                await interaction.editReply({content: `User is already ${policy}`})
                return;
            }
            await access.grantPolicy(targetUser.id, interaction.guildId, policy)
            await interaction.editReply({content: `${targetUser.tag} is from now on ${policy}.`});
            logMessage = `<@${targetUser.id}> is ${policy} from now on.`
        }

        if(action === ACTIONS.remove)
        {
            if(!await rules.hasPolicy(targetUser.id, interaction.guildId, policy)){
                await interaction.editReply({content: `User is already not ${policy}`})
                return;
            }
           await access.revokePolicy(targetUser.id, interaction.guildId, policy)
            await interaction.editReply({content: `${targetUser.tag} is from now on not ${policy}.`});    
            logMessage = `<@${targetUser.id}> is not ${policy} anymore..`


        }
        
        logger.sendLogMessage(interaction.user, interaction.guildId, "impersonation",logMessage)      

        
      
    }
}

