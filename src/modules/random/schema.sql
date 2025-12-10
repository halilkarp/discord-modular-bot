CREATE TABLE IF NOT EXISTS pools (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    guildID    TEXT NOT NULL,
    poolName   TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(poolName, guildID)
);

CREATE TABLE IF NOT EXISTS pool_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    poolID     INTEGER NOT NULL,
    item       TEXT NOT NULL,
    seen       INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);


CREATE INDEX IF NOT EXISTS idx_pool_items_pool_item
ON pool_items(poolID, item);