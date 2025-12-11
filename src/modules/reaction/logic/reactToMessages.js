const { keywordExists } = require("./rules");
const { getReaction } = require("./access");
const {checkOperatorship} = require ("@core/checkOperatorship.js");

async function hasValidKeyword(message) {
  const firstWord = message.content.split(" ")[0];
  return keywordExists(firstWord);
}
async function confirmUser(message, target) {
  return (
    message.author.username.toLowerCase().startsWith(target.toLowerCase()) ||
    message.member.displayName.toLowerCase().startsWith(target.toLowerCase())
  );
}

async function reactToMessages(message) {
  if (!hasValidKeyword(message)){  return; }
  if (!checkOperatorship(message.member, message.guildId, "reactions")) {
    return;
  }
  const splitMessage = message.content.split(" ");
  const hasUserTarget = splitMessage.length > 1;
  const channel = message.channel;
  const reaction = getReaction(splitMessage[0], message.guildId);
  const authorID = message.author.id;
  channel.messages.fetch({ limit: 20, cache: false }).then(async messages => {
   for(const message of messages.values())
   {
     if (hasUserTarget && confirmUser(message, splitMessage[1]))
      await message.react(reaction);
    else if (message.author.id !== authorID) {
      await message.react(reaction);
    }
   }
  });
}

module.exports = { reactToMessages };
