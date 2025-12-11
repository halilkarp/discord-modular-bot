const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {checkOperatorship} = require ("@core/checkOperatorship.js");
const {access, rules} = require("../index")
module.exports = {
  name: "react-options",
  description: "List or modify available reacts",
  data: new SlashCommandBuilder()
    .setName("reactions")
    .setDescription("react-control")
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List the available reactions")
    )
    .addSubcommand((sub) =>
      sub
        .setName("control")
        .setDescription("Add/remove reaction-keyword combinations")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("action")
            .setChoices(
              { name: "add", value: "add" },
              { name: "remove", value: "remove" }
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("keyword")
            .setDescription("insert the associated keyword with the reaction")
            .setRequired(true)
        ).addStringOption(option=>
            option.setName("emoji").setDescription("emoji name if adding").setRequired(false)
        )
    ),
    async execute(client, interaction)
    {
        const subCommand = interaction.options.getSubcommand();
        if(subCommand ==="list")
        {
          const reactionList = access.getReactions(interaction.guildId);
          if(!reactionList)
          {await interaction.reply("No reactions registered for this guild.")
            return;
          }
          const embed = new EmbedBuilder()
                  .setTitle("Available Reactions")
                  .setDescription(reactionList.map((r) => `• **${r.keyword} : ${r.emoji}**`).join("\n"))
                  .setColor(0x00ae86);
                await interaction.reply({ embeds: [embed] });
                return;
        }
        if(subCommand === "control")
        {
           if(!checkOperatorship(interaction.member, interaction.guildId, "reaction")){
                await interaction.editReply({content: "You are not authorized to use this command."});
                return;
            }
          const action = interaction.options.getString("action");
          const keyword = interaction.options.getString("keyword");
          if(action ==="add")
          {
            const emoji = interaction.options.getString("emoji");
            if(!emoji)
              {await interaction.reply("Add a valid emote.") 
                return;}
            const result = access.addReaction(keyword, emoji, interaction.guildId);
            await interaction.reply(result);
            return;
          }
           if(action ==="remove")
          {
            const result = access.removeReaction(keyword, interaction.guildId);
            await interaction.reply(result);
            return;
          }
        }
    }
};
