module.exports = {
async execute(client,interaction)
    {
	if(!interaction.isChatInputCommand()) return;
	const cmd = client.commands.get(interaction.commandName);
	if(!cmd) return
	await cmd.execute(client, interaction);
    }

}
