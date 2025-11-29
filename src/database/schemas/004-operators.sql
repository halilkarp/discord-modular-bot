CREATE TABLE IF NOT EXISTS operators(
         roleID TEXT  NOT NULL,
         guildID TEXT  NOT NULL,
          added_at TEXT NOT NULL DEFAULT (datetime('now')),
         PRIMARY KEY (roleID, guildID)
         );                  
