# discord-modular-bot

A modular Discord bot built with Node.js and designed for scalability. The project emphasizes clean architecture, clear separation of concerns, and runtime-loadable modules.

# Features

- SQLite-based persistence with migration support
- Modular command and feature loading
- Support for slash commands
- Impersonation module (first implemented module; more features coming soon)
### Impersonation Module

Provides a controlled impersonation system with:

- `/impersonate` — impersonate a user
- `/impctl` — add/remove access or protection rules
  - blocked → user cannot use impersonation
  - protected → user cannot be impersonated


---

## Setup
1. Clone the repository
```
git clone https://github.com/halilkarp/discord-modular-bot.git
cd discord-modular-bot
```
2. Install dependencies
```
npm install
```
3. Create your .env file
```
cp .env_example .env
```
Then edit .env and fill in your values
(you can find them at https://discord.com/developers/applications):
```
BOT_TOKEN=<your_discord_bot_token>
APPLICATION_ID=<your_application_id>
```
4. Start the bot
```
npm start        # regular mode - runs once, you have to restart manually
npm run dev      # development mode - auto-restarts on every file change
```


# Directory Structure

```
discord-modular-bot
├── config/
│   └── config.json
│
├── src/
│   ├── bot.js                      # Entry point
│   ├── BotClient.js                # Extended Discord.js client
│   │
│   ├── core/                       # Global infrastructure (NOT a module)
│   │   ├── db.js                   # SQLite connection + schema hashing
│   │   └── checkOperatorship.js    # Operator/role permission check
│   │
│   ├── database/
│   │   └── app.sqlite              # Persistent database (no schema folder anymore)
│   │
│   ├── events/                     # Discord event handlers
│   │   ├── clientReady.js
│   │   └── interactionCreate.js
│   │
│   ├── loaders/                    # Runtime initialization
│   │   ├── CommandLoader.js        # Discovers / loads commands from modules
│   │   ├── EventLoader.js          # Loads event handlers
│   │   └── RegisterCommands.js     # Registers slash commands with Discord API
│   │
│   └── modules/                    # Independent feature modules
│       └── impersonation/          # Impersonation feature module
│           ├── schema.sql          # database schema
│           ├── constants.js        # enums
│           ├── index.js            # Module export aggregator
│           │
│           ├── commands/           # Slash commands for this module
│           │   ├── impersonate.js
│           │   └── impersonate-control.js
│           │
│           └── logic/              # Internal logic
│               ├── access.js       # Mutation API (add/remove policies)
│               ├── rules.js        # Query API 
│               ├── payload.js      # Webhook message payload creator
│               └── webhook.js      # Webhook impersonation sender
│
│
```
# Module Structure
```
This bot uses a module-based design. Each module can contain:

- commands/ → Slash commands belonging to the module
- logic/  → Internal helpers, rules and service functions
- constants.js  → Shared values (enums, policy types, etc.)
- schema.sql → Module-scoped database schema

On startup, the bot hashes each `schema.sql` and applies it only if changed.  
This makes database migrations fully incremental without manual scripts.


Example: `src/modules/impersonation`

Each module contains its own logic, commands, and authorization rules, making new features easy to add without modifying core code.
```

## Status

Actively developed. More modules and examples will be added.


# License

This project is licensed under the [GNU GPLv3](https://github.com/halilkarp/discord-modular-bot/blob/main/LICENSE).

