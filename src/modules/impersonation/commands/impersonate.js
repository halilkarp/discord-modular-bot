const {SlashCommandBuilder, AttachmentBuilder} = require("discord.js");
const {webhook, rules, createEmbed} = require ("@modules/impersonation");
const logger = require("@core/logger.js")
module.exports = {
    name: "impersonate",
    description: "Impersonate someone",
    data: new SlashCommandBuilder().setName("impersonate").setDescription("Impersonate another user by their tag or ID").
    addStringOption(option => option.setName("text").setDescription("text").setRequired(true)).
    addUserOption(option => option.setName("username").setDescription("username").setRequired(false)).addAttachmentOption(option=>
		option.setName("attachment").setDescription("attachment").setRequired(false)
	),
    async execute(client, interaction)
    {
	const isDenied = await rules.isBlocked(interaction.user.id, interaction.guildId);

	if(isDenied){
	    await interaction.followUp({
		content: "You don't have access to this command"
	    });
	return;
	}
	await interaction.deferReply({ephemeral: true});
	const targetLabel = interaction.options.getUser("username") || interaction.user;
	const text = interaction.options.getString("text");

	if(await rules.isProtected(targetLabel.id, interaction.guildId)&& targetLabel.id != interaction.user.id)
	{
	    await interaction.followUp({
		content: "Can't impersonate this person"
	    });
	    return;
	}
	
	const attachment = interaction.options.getAttachment("attachment");
	const file = attachment!==null ?  new AttachmentBuilder(attachment.url, {name : attachment.name})  :null;
	try  {
	await webhook(text, targetLabel, interaction.channel, file);
	const embed = createEmbed(interaction.user, targetLabel, text, file)
	await logger.sendLogMessage(interaction.user,
							interaction.guildId,
							"impersonation",
							{customEmbeds : [embed], files : file ? [file] : []});
	  await interaction.editReply( {
		content: `Impersonated <@${targetLabel.id}>`
	    });
	}catch(err) {console.error(err)}
	
}
}

