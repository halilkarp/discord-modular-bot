const { logEmitter } = require("@core/logger.js");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "moduleLog",
  execute(client, payLoad) {
    const {
      author,
      channelId,
      moduleName,
      content,
      customEmbeds = [],
      files = []
    } = payLoad;
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.warn(`Invalid channel for ${moduleName}`);
      return;
    }
    const defaultEmbed = new EmbedBuilder()
      .setTitle(`${moduleName}`)
      .setAuthor({ name: `${author.displayName}`, iconURL: author.avatarURL() })
      .addFields({
        name: "Action",
        value: content,
        inline: true,
      });
    defaultEmbed.setTimestamp();
    const embed = customEmbeds.length > 0 ? [...customEmbeds] : [defaultEmbed];
    channel.send({ embeds: embed, files: files }).catch(() => {});
  },
  emitter: logEmitter,
};
