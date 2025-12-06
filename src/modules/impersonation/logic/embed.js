const {EmbedBuilder, AttachmentBuilder,} = require("discord.js")

module.exports = function createEmbed(author, target, message, attachment = null) {

const embed = new EmbedBuilder().setTitle(`Impersonate`).
        setAuthor({name: `${author.displayName}`, iconURL : author.avatarURL()})
        .setThumbnail(target.avatarURL()). 
            setDescription(`<@${target.id}> : ${message}`)
            if(attachment)
        embed.setImage(`attachment://${attachment.name}`);
        
        embed.setTimestamp();

        return embed;
}