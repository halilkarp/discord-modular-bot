const { keywordExists } = require("./rules");
const access = require("./access");
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
  if (!hasValidKeyword(message)) return;

  if (!checkOperatorship(message.member, message.guildId, "reaction")) return;

  const parts = message.content.trim().split(/\s+/);
  const keyword = parts[0];
  const target = parts[1] || null;
  const hasUserTarget = target !== null;

  const reactions = access.getReactionsForKeyword(keyword, message.guildId);
  if (!reactions || reactions.length === 0) return;

  const authorID = message.author.id;

  message.channel.messages
    .fetch({ limit: 20, cache: false })
    .then(async (messages) => {
      for (const msg of messages.values()) {
        // TARGET MODE — only react to that user
        if (hasUserTarget && confirmUser(msg, target)) {
          try {
            for (const emoji of reactions) {
              await msg.react(emoji);
            }
          } catch (err) {
            console.error(err.message);
          }
          continue;
        }

        // DEFAULT MODE — react to everyone except author
        if (!hasUserTarget && msg.author.id !== authorID) {
          try {
            for (const emoji of reactions) {
              await msg.react(emoji);
            }
          } catch (err) {
            console.error(err.message);
          }
        }
      }
    });
}

module.exports = { reactToMessages };
