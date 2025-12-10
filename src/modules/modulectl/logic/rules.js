const {HANDLERS} = require ("../constants");

function existsInTable(entityId, moduleName, guildId, setting)
{
    return HANDLERS[setting]?.check(entityId, moduleName, guildId);
}
function isNotEmpty(moduleName, guildID, setting)
{
    return HANDLERS[setting]?.get(moduleName, guildID) !== null
}



module.exports = {existsInTable, isNotEmpty}