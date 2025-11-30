# discord-modular-bot

A modular Discord bot built with Node.js and designed for scalability. The project emphasizes clean architecture, clear separation of concerns, and runtime-loadable modules.

## Features

- SQLite-based persistence with migration support
- Modular command and feature loading
- Support for slash commands
- Impersonation module (first implemented module; more features coming soon)

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
│   ├── bot.js                 # Entry point
│   ├── BotClient.js           # Extended Discord.js client
│   │
│   ├── core/                  # Shared utilities across modules
│   │   ├── db.js              # SQLite connection 
│   │   └── checkOperatorship.js  # Operator/owner permission check
│   │
│   ├── database/
│   │   ├── app.sqlite         # SQLite database 
│   │   └── schemas/           # SQL migrations
│   │       ├── 001-init.sql
│   │       ├── 002-deniedUsers.sql
│       │   ├── 003-deniedTargets.sql
│       │   └── 004-operators.sql
│   │
│   ├── events/                # Discord client events
│   │   ├── clientReady.js
│   │   └── interactionCreate.js
│   │
│   ├── loaders/               # Startup logic
│   │   ├── CommandLoader.js   # Loads commands from feature modules
│   │   ├── EventLoader.js     # Loads event handlers
│   │   └── RegisterCommands.js # Registers slash commands with Discord API
│   │
│   └── modules/
│       └── impersonation/     # Feature module
│
```
# Module Structure
```

Commands are grouped into self-contained feature modules. Each module
contains its own commands and logic, and exposes a public API through
`index.js`. This allows commands to consume module functionality without
knowing internal file paths.

Example: `src/modules/impersonation`

Each module contains its own logic, commands, and authorization rules, making new features easy to add without modifying core code.
```

## Status

-Actively developed. More modules and examples will be added.


# License

This project is licensed under the [GNU GPLv3](https://github.com/halilkarp/discord-modular-bot/blob/main/LICENSE).
