
const webhook = require ("./logic/webhook.js");
const access = require ("./logic/access.js");
const rules = require("./logic/rules.js");
const { POLICY, ACTIONS } = require("./constants");
module.exports = {
    webhook,
    access,
    rules,
    POLICY,
    ACTIONS
}