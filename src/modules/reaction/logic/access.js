const db = require("@db");

// get reactions for one keyword
function getReactionsForKeyword(keyword, guildID) {
  return db
    .prepare("SELECT emoji FROM reactions WHERE keyword = ? AND guildID = ?")
    .all(keyword, guildID)
    .map(r => r.emoji);
}

// get all reactions in a guild (for listing)
function getReactionsForGuild(guildID) {
  return db
    .prepare("SELECT keyword, emoji FROM reactions WHERE guildID = ?")
    .all(guildID);
}

function addReaction(keyword, emoji, guildID) {
  db.prepare(
    "INSERT INTO reactions (keyword, emoji, guildID) VALUES (?, ?, ?)"
  ).run(keyword, emoji, guildID);

  return `Added ${emoji} to ${keyword}.`;
}

function removeReaction(keyword, guildID) {
  db.prepare("DELETE FROM reactions WHERE keyword = ? AND guildID = ?")
    .run(keyword, guildID);

  return `Removed all reactions for keyword ${keyword}.`;
}

module.exports = {
  getReactionsForKeyword,
  getReactionsForGuild,
  addReaction,
  removeReaction
};
