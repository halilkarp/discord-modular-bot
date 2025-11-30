const db = require("@db");

const VALID_TABLES = ["deniedUsers", "deniedTargets"];
function existsInTable(table, userID, guildID)
{
   if(!VALID_TABLES.includes(table)) throw new Error("Invalid table name");
    //Check if the user is in the given table
    return  db.prepare(`SELECT 1 FROM ${table} WHERE userID= ? AND guildID = ?  LIMIT 1;`).get(userID, guildID) !== undefined;
}

  function isDeniedUser(userID, guildID) {
    return existsInTable("deniedUsers", userID, guildID);

}
function isDeniedTarget(userID, guildID)
{
    return existsInTable("deniedTargets", userID, guildID);
}
module.exports =  {isDeniedUser, isDeniedTarget};
