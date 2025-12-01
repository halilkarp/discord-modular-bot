const db = require("@db");
const {POLICY} = require ("../constants");

function hasPolicy(userID, guildID, policyType) {
    return db.prepare(`
        SELECT 1 FROM impersonationPolicies
        WHERE userID = ? AND guildID = ? AND policyType = ?
        LIMIT 1
    `).get(userID, guildID, policyType) !== undefined;
}

const isBlocked = (userID, guildID) =>
    hasPolicy(userID, guildID, POLICY.BLOCKED);

const isProtected = (userID, guildID) =>
    hasPolicy(userID, guildID, POLICY.PROTECTED);

module.exports = { isBlocked, isProtected, hasPolicy};
