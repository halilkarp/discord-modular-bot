 discord-modular-bot

A modular Discord bot built with Node.js and designed for scalability. The project emphasizes clean architecture, clear separation of concerns, and runtime-loadable modules.

# Features

- SQLite-based persistence with migration support
- Modular command and feature loading
- Support for slash commands
- Per-module log channels configurable at runtime
- Impersonation module (first feature module; more coming)
- Module control (`modulectl`) module for runtime configuration

### Impersonation Module

Provides a controlled impersonation system with:

- `/impersonate` — impersonate a user
<img src="https://i.imgur.com/FF3Bgj4.gif"/>

- `/impctl` — add/remove access or protection rules
  - `blocked` → user cannot use impersonation
  - `protected` → user cannot be impersonated

All impersonation actions are logged to the configured log channel for the `impersonation` module in that guild (if set).
### Module Control (`modulectl`) Module

Provides runtime configuration for modules:

- `/logchannel` — set/unset a log channel for a given module
  - `action` → `"set"` or `"unset"`
  - `module` → one of the available module names
  - `channel` → target log channel (required for `"set"`)

- `/operators` — Add/remove an operator for a given module
  - `action` → `"add"` or `"remove"`
  - `module` → one of the available module names
  - `role` → target log channel (required for `"set"`)
  
These commands write log channel/operator configuration to the database. Other modules (like `impersonation`) use this configuration through the core logger.

## Logging System

Logging is handled as a concern in `src/core`:

- `core/logConfig.js` — stores and retrieves module log channel mappings in SQLite
- `core/logger.js` — takes a module name + guild and sends log messages to the configured channel

Example usage in the impersonation command:

```
  await logger.sendLogMessage(interaction.user,
    interaction.guildId,
    "impersonation",
     {customEmbeds : [embed] } -- allows for custom embeds or a default one if left empty

```
If no log channel is set for a module/guild, the logger fails gracefully and prints a warning instead of breaking the command.
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
npm run dev      # development mode hot reload- auto-restarts on every file change
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
│   │   ├── db.js                   # better-sqlite3 connection + migration system
│   │   ├── schema.sql              # Core migrations table
│   │   ├── checkOperatorship.js    # Global operator permission check
│   │   ├── operatorConfig.js       # Operator persistence (add/remove/get)
│   │   ├── logConfig.js            # Per-module log channel persistence
│   │   └── logger.js               # Unified logger → moduleLog event
│   │
│   ├── database/
│   │   └── app.sqlite              # SQLite database
│   │
│   ├── events/
│   │   ├── clientReady.js
│   │   ├── interactionCreate.js
│   │   └── moduleLog.js            # New: centralized module-specific logging
│   │
│   ├── loaders/
│   │   ├── CommandLoader.js        # Auto-discovers commands from all modules
│   │   ├── EventLoader.js          # Loads all events
│   │   └── RegisterCommands.js     # Bulk registers slash commands
│   │
│   └── modules/                    # Runtime-loadable, independent modules
│       └── index.js                # Module registry & metadata
│
│       ├── impersonation/          # Feature module
│       │   ├── schema.sql
│       │   ├── constants.js        # BLOCKED / PROTECTED policies
│       │   ├── index.js            # Exports { commands, logic, constants }
│       │   │
│       │   ├── commands/
│       │   │   ├── impersonate.js  # /impersonate
│       │   │   └── control.js      # /impctl
│       │   │
│       │   └── logic/
│       │       ├── access.js       # add/remove policies
│       │       ├── rules.js        # isBlocked / isProtected
│       │       ├── embed.js        # Log embed builder
│       │       ├── payload.js      # Webhook payload
│       │       └── webhook.js      # Sends via webhook
│       │
│       └── modulectl/              # Configuration module
│           ├── constants.js        # HANDLERS, MODULE_SETTING, etc.
│           ├── index.js            # Exports commands + HANDLERS
│           │
│           ├── commands/
│           │   ├── logchannel.js   # /logchannel set|unset
│           │   └── operators.js    # /operator add|remove
│           │
│           └── logic/
│               ├── access.js       # add/remove wrapper
│               └── rules.js        #  query wrapper

```
# Module Structure

This bot uses a module-based design. Each module can contain:

- `commands/` → Slash commands belonging to the module
- `logic/` → Internal helpers, rules and service functions
- `constants.js` → Shared values (enums, policy types, etc.)
- `schema.sql` → Module-scoped database schema

Some modules implement **features** (e.g. `impersonation`), while others implement **configurations** (e.g. `modulectl` for log channels). On startup, the bot hashes each `schema.sql` and applies it only if changed, making database migrations incremental without manual scripts.


Example: `src/modules/impersonation`

Each module contains its own logic, commands, and authorization rules, making new features easy to add without modifying core code.


## Status

Actively developed. More modules and examples will be added.


# License

This project is licensed under the [GNU GPLv3](https://github.com/halilkarp/discord-modular-bot/blob/main/LICENSE).

