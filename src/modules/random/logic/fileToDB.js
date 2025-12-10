const { createPool, addItem } = require("./access");
const { poolNameExists } = require("./rules");

module.exports = async function createNewPool(poolName, guildID, attachment) {
  if (poolNameExists(poolName, guildID)) return "Pool name already exists.";
  const res = await fetch(attachment);
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  let message = createPool(poolName, guildID);
  const length = lines.length;

  for (const line of lines) {
    const entry = line.trim();
    if (!entry) continue;
    addItem(poolName, guildID, entry);
  }
  return message + ` with ${length} entries`;
};
