const db = require("@db");

function itemExistsInPool(poolID, item) {
  return (
    db
      .prepare("SELECT 1 FROM pool_items WHERE poolID = ? AND item = ?")
      .get(poolID, item) !== undefined
  );
}

function poolNameExists(poolName, guildID) {
  return (
    db
      .prepare("SELECT 1 FROM pools WHERE poolName = ? AND guildID = ?")
      .get(poolName, guildID) !== undefined
  );
}

module.exports = { itemExistsInPool, poolNameExists };
