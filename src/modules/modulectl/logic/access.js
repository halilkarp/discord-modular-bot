const {HANDLERS} = require ("../constants");

function add(entityId, moduleName, guildId, setting)
{
    HANDLERS[setting]?.add(entityId, moduleName, guildId);
}



function remove(entityId, moduleName, guildId, setting)
{
    HANDLERS[setting]?.remove(entityId, moduleName, guildId);
}


module.exports= {add, remove}