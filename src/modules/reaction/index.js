const access = require("./logic/access");
const rules = require("./logic/rules")
const {reactToMessages } = require("./logic/reactToMessages.js")

module.exports = {
    onMessage : reactToMessages,
    needsOperator : true,
    access,
    rules
}