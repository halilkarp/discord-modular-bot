
const webhook = require ("./logic/webhook.js");
const access = require ("./logic/impersonatorAccess.js");
const rules = require("./logic/impersonationRules.js");

module.exports = {
    webhook,
    access,
    rules
}