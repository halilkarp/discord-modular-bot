const {SlashCommandBuilder} = require("discord.js");
const {webhook, rules} = require ("@modules/impersonation");
module.exports = {
    name: "impersonate",
    description: "Impersonate someone",
    data: new SlashCommandBuilder().setName("impersonate").setDescription("Impersonate another user by their tag or ID").
    addStringOption(option => option.setName("text").setDescription("text").setRequired(true)).
    addUserOption(option => option.setName("username").setDescription("username").setRequired(false)),
    async execute(client, interaction)
    {
	console.log("bruuu");
	const isDenied = await rules.isBlocked(interaction.user.id, interaction.guildId);

	await interaction.deferReply({ephemeral: true});
	if(isDenied){
	    await interaction.followUp( ({
		content: "You don't have access to this command"
	    }));
	return;
	}
   
	const target = interaction.options.getUser("username");
	// Default to the author user object if no argument is given
	const user = target ? target : interaction.user
	if(await rules.isProtected(user.id, interaction.guildId)&& user.id != interaction.user.id)
	{
	    await interaction.followUp(({
		content: "Can't impersonate this person"
	    }));
	    return;
	}
	const text = interaction.options.getString("text");
	await webhook(text, user, interaction.channel);
	await interaction.deleteReply();

}
}

