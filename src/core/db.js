const Database = require('better-sqlite3');
const path = require("path");
const fs = require("fs");
const dbPath = path.join(__dirname,"../database/app.sqlite");
const db = new Database(dbPath);
const crypto = require("crypto");

console.log("Initializing the bot database.")
db.exec(`CREATE TABLE IF NOT EXISTS migrations (
    moduleName TEXT NOT NULL, 
    hash TEXT NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (moduleName));`);  

function generateHash(content)
{
  return crypto.createHash("sha256").update(content,"utf-8").digest("hex");
}
function applySchema(moduleName, schemaPath)
{
  const sql = fs.readFileSync(schemaPath,"utf-8")
  const hash = generateHash(sql);
  const exists = db.prepare("SELECT hash FROM migrations WHERE moduleName = ?").get(moduleName);
  if(exists && exists.hash == hash) return; //schema unchanged

  db.exec(sql);
  db.prepare("INSERT OR REPLACE INTO migrations (moduleName, hash) VALUES (?, ?) ").run(moduleName, hash)
  console.log(`Applied the schema for the ${moduleName} module.`)
}
const coreSchema = path.join(__dirname, "schema.sql");
if(fs.existsSync(coreSchema))
  applySchema("core", coreSchema);

const modulesPath = path.join(__dirname,"../modules");
for(const moduleName of fs.readdirSync(modulesPath))
{
  const modulePath = path.join(modulesPath, moduleName);
  const schema = path.join(modulePath, "schema.sql");
  if(fs.existsSync(schema))
    applySchema(moduleName, schema);
}


module.exports = db;    
