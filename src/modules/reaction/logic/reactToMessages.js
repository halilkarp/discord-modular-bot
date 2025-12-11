const { keywordExists } = require("./rules");
const { getReaction } = require("./access");
const { checkOperatorship } = require("@core/checkOperatorship.js");

function hasValidKeyword(message) {
  const firstWord = message.content.split(" ")[0];
  return keywordExists(firstWord, message.guildId);
}
function confirmUser(message, target) {
  const usernameMatch = message.author?.username
    ?.toLowerCase()
    .startsWith(target.toLowerCase());

  const displayNameMatch = message.member?.displayName
    ?.toLowerCase()
    .startsWith(target.toLowerCase());
  return usernameMatch || displayNameMatch;
}

async function reactToMessages(message) {
  if (!hasValidKeyword(message)) {
    return;
  }

  if (!checkOperatorship(message.member, message.guildId, "reaction")) {
    return;
  }

  const splitMessage = message.content.split(" ");
  const hasUserTarget = splitMessage.length > 1;
  const channel = message.channel;
  const reaction = getReaction(splitMessage[0], message.guildId);
  const authorID = message.author.id;

  channel.messages.fetch({ limit: 20, cache: false }).then(async (messages) => {
    for (const msg of messages.values()) {
      if (hasUserTarget && confirmUser(msg, splitMessage[1])){
        try {
          await msg.react(reaction);
        } catch (err) {
          console.error(err.message);
        }
        continue
      }
      if (!hasUserTarget && msg.author.id !== authorID) {
        try {
          await msg.react(reaction);
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  });
}

module.exports = { reactToMessages };
