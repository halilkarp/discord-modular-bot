const {REST, Routes} = require("discord.js");
const rest = new REST({version : "10"}).setToken(process.env.BOT_TOKEN);

module.exports = async function RegisterCommands(client)
{
    const guilds = await client.guilds.fetch();
    for(const [guildID, guild]  of guilds)
    {
	try{
	    rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, guild.id),
		{
		    body: client.commands.map(cmd=> cmd.data.toJSON())
		});

	}catch(err)
	{console.error( err); }
    }
}
