
const webhook = require ("./logic/webhook.js");
const access = require ("./logic/access.js");
const rules = require("./logic/rules.js");
const { POLICY, ACTIONS } = require("./constants");
const  createEmbed = require("./logic/embed.js")
module.exports = {
    name: "impersonation",
    needsLogging : true,
    needsOperator : true,
    webhook,
    access,
    rules,
    POLICY,
    ACTIONS,
    createEmbed
}