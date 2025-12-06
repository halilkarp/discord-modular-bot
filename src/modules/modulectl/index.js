const {MODULE_SETTING, HANDLERS} = require("./constants")
const access = require("./logic/access")
const rules = require("./logic/rules");
module.exports ={
    name: "modulectl",
    needsLogging :true,
    needsOperator : true,
    MODULE_SETTING,
    HANDLERS,
    access,
    rules

}