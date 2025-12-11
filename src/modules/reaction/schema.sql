CREATE TABLE IF NOT EXISTS reactions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guildID TEXT NOT NULL,
    keyword TEXT NOT NULL,
    emoji TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);