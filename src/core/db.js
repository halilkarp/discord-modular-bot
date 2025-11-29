const Database = require('better-sqlite3');
const path = require("path");
const fs = require("fs");
const dbPath = path.join(__dirname,"../database/app.sqlite");
const db = new Database(dbPath);
const schemaDir = path.join(__dirname, "../database/schemas");
const MIGRATION_TABLE_CHECK =
  "SELECT name FROM sqlite_master WHERE type='table' AND name='migrations';";

const SELECT_MIGRATIONS =
  "SELECT name FROM migrations";

const INSERT_MIGRATION =
  "INSERT INTO migrations (name) VALUES (?)";
  const tableExists  = db.prepare(MIGRATION_TABLE_CHECK).get() != null

if(!tableExists)
{
    console.log("Initializing the bot database.")
    db.exec(fs.readFileSync(path.join(schemaDir, "001-init.sql"), "utf8"));
    db.prepare(INSERT_MIGRATION).run("001-init.sql");
}


const schemas = db.prepare(SELECT_MIGRATIONS).all().map(s => s.name);
const files = fs.readdirSync(schemaDir).filter(f=> f.endsWith(".sql"));

for(const file of files)
{
    if(!schemas.includes(file))
	{
	    const sql = fs.readFileSync(path.join(schemaDir, file), "utf8");
	    db.exec(sql);
	    db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
	}
}
module.exports = db;    
