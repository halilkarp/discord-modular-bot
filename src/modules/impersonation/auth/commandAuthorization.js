const path = require("path");
const db = require(path.join(APP_ROOT, "src/modules/shared/db.js"));

const VALID_TABLES = ["deniedUsers", "deniedTargets"];
function entryExists(table, userID, guildID)
{
   if(!VALID_TABLES.includes(table)) throw new Error("Invalid table name");
    //Check if the user is in the given table
    return  db.prepare(`SELECT 1 FROM ${table} WHERE userID= ? AND guildID = ?  LIMIT 1;`).get(userID, guildID) !== undefined;
}

  function isDeniedUser(userID, guildID) {
    return entryExists("deniedUsers", userID, guildID);

}
     function isDeniedImpersonation(userID, guildID)
{

	return entryExists("deniedTargets", userID, guildID);
}
module.exports =  {isDeniedUser, isDeniedImpersonation};
