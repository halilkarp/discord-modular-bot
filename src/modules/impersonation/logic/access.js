const db = require("@db");

async function grantPolicy(userID, guildID, type) {
    db.prepare(`
        INSERT OR IGNORE INTO impersonationPolicies (userID, guildID, policyType)
        VALUES (?, ?, ?)
    `).run(userID, guildID, type);
}

async function revokePolicy(userID, guildID, type) {
    db.prepare(`
        DELETE FROM impersonationPolicies
        WHERE userID = ? AND guildID = ? AND policyType = ?
    `).run(userID, guildID, type);
}


module.exports = {
   grantPolicy, revokePolicy
};
