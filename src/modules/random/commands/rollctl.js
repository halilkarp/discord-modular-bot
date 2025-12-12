const { SlashCommandBuilder } = require("discord.js");
const { fileToDB, access } = require("../index");
const { checkOperatorship } = require("@core/checkOperatorship.js");
const logger = require("@core/logger.js");
module.exports = {
  name: "rollctl",
  description: "rollctl",
  data: new SlashCommandBuilder()
    .setName("rollctl")
    .setDescription("roll")
    //create new pool
    .addSubcommand((sub) =>
      sub
        .setName("create")
        .setDescription("Create a new pool from an attachment")
        .addStringOption((option) =>
          option.setName("pool").setDescription("Pool name").setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setName("attachment")
            .setDescription("Upload a text file")
            .setRequired(false)
        )
    )
    //edit an existing pool
    .addSubcommand((sub) =>
      sub
        .setName("modify")
        .setDescription("Add or remove entries to/from a pool")
        .addStringOption((option) =>
          option.setName("pool").setDescription("Pool name").setRequired(true)
        )
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
          option.setName("entry").setDescription("entry").setRequired(true)
        )
    )
    //purge a pool
    .addSubcommand((sub) =>
      sub
        .setName("purge")
        .setDescription("Completely remove a pool")
        .addStringOption((option) =>
          option.setName("pool").setDescription("pool").setRequired(true)
        )
    ),
  async execute(client, interaction) {
    await interaction.deferReply();
    if (!checkOperatorship(interaction.member, interaction.guildId, "random")) {
      await interaction.editReply({
        content: "You are not authorized to use this command.",
      });
      return;
    }
    const sub = interaction.options.getSubcommand();
    const poolName = interaction.options.getString("pool");
    let logMessage = ``;
    if (sub === "create") {
      try {
        const attachment = interaction.options.getAttachment("attachment");
        if (!attachment) {
          let message = access.createPool(poolName, interaction.guildId);
          logMessage = message;

          interaction.editReply(message);
        }
        const result = await fileToDB(
          poolName,
          interaction.guildId,
          attachment.url
        );
        await interaction.editReply(result);
        logMessage = result;
      } catch (err) {
        console.error(err);

        await interaction.followUp(`Failed to create a pool.`);
      }
    }
    if (sub === "purge") {
      const result = access.purgePool(poolName, interaction.guildId);
      try {
        await interaction.editReply(result);
        logMessage = result;
      } catch (err) {
        console.error(err);

        await interaction.followUp(`Something went wrong.`);
      }
    }

    const action = interaction.options.getString("action");
    let entry = interaction.options.getString("entry");
    if (action === "add") {
      const result = access.addItem(poolName, interaction.guildId, entry);
      try {
        await interaction.editReply(result);
        logMessage = result;
      } catch (err) {
        console.error(err);
      }
    }
    if (action === "remove") {
      const result = access.removeItem(poolName, interaction.guildId, entry);
      try {
        await interaction.editReply(result);
        logMessage = result;
      } catch (err) {
        console.error(err);
      }
    }

    logger.sendLogMessage(
      interaction.user,
      interaction.guildId,
      "random",
      logMessage
    );
  },
};
