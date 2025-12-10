const db = require("@db");
const rules = require("./rules");
function getPoolID(poolName, guildID) {
  const pool = db
    .prepare("SELECT id FROM pools WHERE poolName = ? AND guildID = ?")
    .get(poolName, guildID);
  return pool ? pool.id : null;
}

function getPoolNames(guildID) {
  const poolNames = db
    .prepare("SELECT poolName FROM pools WHERE guildID = ?")
    .all(guildID);
  return poolNames;
}

function createPool(poolName, guildID) {
  if (rules.poolNameExists(poolName, guildID))
    return "Pool name already exists";
  db.prepare(
    "INSERT OR IGNORE INTO pools (poolName, guildID) VALUES (?, ?)"
  ).run(poolName, guildID);
  return `A pool has been created with the name ${poolName}`;
}

function purgePool(poolName, guildID) {
  const poolID = getPoolID(poolName, guildID);
  if (!poolID) return "Not a valid pool.";

  db.prepare("DELETE FROM pool_items WHERE poolID = ?").run(poolID);
  db.prepare("DELETE FROM pools WHERE id = ?").run(poolID);
  return "Purged the pool successfully.";
}

function addItem(poolName, guildID, item) {
  const poolID = getPoolID(poolName, guildID);
  if (!poolID) return "Pool does not exist.";
  let entry = item;
  if (entry.startsWith("https://")) entry = entry.split("?ex=")[0];
  if (rules.itemExistsInPool(poolID, entry)) return "Item already exists.";

  db.prepare("INSERT INTO pool_items (poolID, item) VALUES (?, ?) ").run(
    poolID,
    entry
  );
  return `Added a new item to ${poolName}.`;
}
function removeItem(poolName, guildID, item) {
  const poolID = getPoolID(poolName, guildID);
  if (!poolID) return "Pool does not exist.";
  if (!rules.itemExistsInPool(poolID, item)) return "Item doesn't exist.";

  db.prepare("DELETE FROM pool_items WHERE poolID = ? AND item = ?").run(
    poolID,
    item
  );
  return `Removed an item from ${poolName}.`;
}
function getRandomItem(poolName, guildID) {
  const poolID = getPoolID(poolName, guildID);
  if (!poolID) {
    console.error("Pool does not exist.");
    return null;
  }
  const randomItem = db
    .prepare(
      `SELECT id, item FROM pool_items WHERE id IN(
        SELECT id FROM pool_items 
        WHERE poolID = ? AND seen = 0 
        ORDER BY RANDOM() 
        LIMIT 10)
        ORDER BY RANDOM() LIMIT 1`
    )
    .get(poolID);

  // reset table
  if (!randomItem) {
    db.prepare("UPDATE pool_items SET seen = 0 WHERE poolID = ?").run(poolID);
    return getRandomItem(poolName, guildID);
  }
  db.prepare(
    `
        UPDATE pool_items SET seen = 1 WHERE id = ?
    `
  ).run(randomItem.id);

  return randomItem.item;
}

module.exports = {
  createPool,
  purgePool,
  addItem,
  removeItem,
  getPoolNames,
  getRandomItem,
};
