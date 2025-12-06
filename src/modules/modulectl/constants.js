const  operatorConfig  = require("@core/operatorConfig.js");
const logConfig = require("@core/logConfig.js")
const MODULE_SETTING =
{
    LOG_CHANNELS : "LOG_CHANNELS",
    OPERATORS : "OPERATORS"
}
const HANDLERS ={
    OPERATORS : {
        get   : (module, guild) => operatorConfig.getOperator(module, guild),
        check : (id, module, guild) =>  operatorConfig.isOperator(id, module, guild),
        add : (id, module, guild) =>  operatorConfig.addOperator(id, module, guild),
        remove : (id, module, guild) =>  operatorConfig.removeOperator(id, module, guild),

    },
    LOG_CHANNELS : {
        get  : (module, guild) => logConfig.getLogChannel(module, guild),
        check : (id, module, guild) =>  logConfig.isLogChannel(id, module, guild),
        add : (id, module, guild) =>  logConfig.setLogChannel(id, module, guild),
        remove : (_, module, guild) =>  logConfig.unsetLogChannel(module, guild),
    }
}
module.exports ={

    MODULE_SETTING,
    HANDLERS
}