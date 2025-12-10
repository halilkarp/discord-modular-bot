const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { access } = require("../index");
module.exports = {
  name: "roll",
  description: "roll",
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("roll")
    .addSubcommand((sub) =>
      sub
        .setName("post")
        .setDescription("Post a random line from the given pool")

        .addStringOption((option) =>
          option.setName("pool").setDescription("pool").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List the possible pools to roll from.")
    ),
  async execute(client, interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === "list") {
      const poolNames = access.getPoolNames(interaction.guildId);
      if (!poolNames.length) {
        await interaction.reply({
          content: "No pools exist.",
          ephemeral: true,
        });
        return;
      }
      const embed = new EmbedBuilder()
        .setTitle("Available Pools")
        .setDescription(poolNames.map((p) => `• **${p.poolName}**`).join("\n"))
        .setColor(0x00ae86);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const pool = interaction.options.getString("pool");
    if (!pool) {
      await interaction.reply({
        content: "Invalid pool name",
        ephemeral: true,
      });
      return;
    }
    const random = access.getRandomItem(pool, interaction.guildId);
    if (!random) {
      await interaction.reply({
        content: "Invalid pool name",
        ephemeral: true,
      });
      return;
    }
    await interaction.reply(random);
  },
};
