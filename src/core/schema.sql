CREATE TABLE IF NOT EXISTS logChannels (
    guildID     TEXT NOT NULL,
    channelID   TEXT NOT NULL,
    moduleName  TEXT NOT NULL,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (guildID, moduleName)
);

CREATE TABLE IF NOT EXISTS moduleOperators (
    guildID     TEXT NOT NULL,
    roleID    TEXT NOT NULL,  
    moduleName  TEXT NOT NULL,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (guildID, moduleName, roleID)
);
