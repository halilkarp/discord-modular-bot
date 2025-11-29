CREATE TABLE IF NOT EXISTS deniedUsers(
    userID TEXT  NOT NULL,
    guildID TEXT  NOT NULL,
     added_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (userID, guildID)
    );
