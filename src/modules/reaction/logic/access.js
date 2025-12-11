const db = require("@db");
const rules = require("./rules.js");

function getReaction(keyword, guildID) {
  if (rules.keywordExists(keyword, guildID))
    return db
      .prepare("SELECT emoji FROM reactions WHERE keyword = ? AND guildID = ?")
      .get(keyword, guildID).emoji;
  return null;

}

function getReactions(guildID) {
  if (rules.guildHasReaction(guildID))
    return db
      .prepare("SELECT * FROM reactions WHERE guildID = ?")
      .all(guildID);
  return null;
}

function addReaction(keyword, emoji, guildID) {
  if (rules.keywordExists(keyword, guildID)) return "Keyword already exists.";
  if (rules.emojiExists(emoji, guildID)) return "Emoji already exists.";
  db.prepare(
    "INSERT INTO reactions (keyword, emoji, guildID) VALUES (?, ?, ?)"
  ).run(keyword, emoji, guildID);
  return `Added a new keyword-reaction combination.`;
}

function removeReaction(keyword, guildID) {
  if (!rules.keywordExists(keyword, guildID))
    return "Keyword already doesn't exist.";

  db.prepare("DELETE FROM reactions WHERE keyword = ? AND guildID = ?").run(
    keyword,
    guildID
  );
  return `Removed the ${keyword} keyword.`;
}


module.exports = {getReaction, getReactions, addReaction, removeReaction}