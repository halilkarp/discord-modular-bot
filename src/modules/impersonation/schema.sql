CREATE TABLE IF NOT EXISTS impersonationPolicies
(
    guildID TEXT NOT NULL,
    userID TEXT NOT NULL,
    policyType TEXT NOT NULL CHECK 
        (policyType IN ('BLOCKED', 'PROTECTED')),
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (guildID, userID, policyType)
);