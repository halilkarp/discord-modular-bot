const path = require("path");
const {SlashCommandBuilder, MessageFlags} = require("discord.js");
const {isDeniedUser, isDeniedImpersonation} = require (path.join(__dirname, "../auth/commandAuthorization.js"));
const sendMessage = require (path.join(__dirname, "../logic/webhook.js"));
module.exports = {
    name: "impersonate",
    description: "Impersonate someone",
    data: new SlashCommandBuilder().setName("impersonate").setDescription("Impersonate another user by their tag or ID").
    addStringOption(option => option.setName("text").setDescription("text").setRequired(true)).
    addMentionableOption(option => option.setName("username").setDescription("username").setRequired(false)),
    async execute(client, interaction)
    {
	console.log("bruuu");
	const isDenied = await isDeniedUser(interaction.user.id, interaction.guildId);

	await interaction.deferReply({ephemeral: true});
	if(isDenied){
	    await interaction.followUp( ({
		content: "You don't have access to this command"
	    }));
	return;
	}
   
	const target = interaction.options.getMentionable("username");
	// Default to the author user object if no argument is given
	const user = target ? target : interaction.user
	if( isDeniedImpersonation(user.id, interaction.guildId)&& user.id != interaction.user.id)
	{
	    await interaction.followUp(({
		content: "Can't impersonate this person"
	    }));
	    return;
	}
	const text = interaction.options.getString("text");
	await sendMessage(text, target, interaction.channel);
	await interaction.deleteReply();

}
}
