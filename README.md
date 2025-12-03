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

This command writes log channel configuration to the database. Other modules (like `impersonation`) use this configuration through the core logger.

## Logging System

Logging is handled as a concern in `src/core`:

- `core/logConfig.js` — stores and retrieves module log channel mappings in SQLite
- `core/logger.js` — takes a module name + guild and sends log messages to the configured channel

Example usage in the impersonation command:

```
await logger.sendLogMessage(
  client,
  interaction.guildId,
  "impersonation",
  `${interaction.user.username} : ${targetLabel} : ${text}`
);

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
│   │   ├── db.js                   # SQLite connection
│   │   ├── schema.sql              # Core schema (migrations table etc.)
│   │   ├── checkOperatorship.js    # Operator/role permission check
│   │   ├── logConfig.js            # Per-module log channel persistence
│   │   └── logger.js               # Sends log messages using logConfig
│   │
│   ├── database/
│   │   └── app.sqlite              # Persistent database
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
│   └── modules/                    # Independent feature/configuration modules
│       ├── index.js                # Module registry (exports module list etc.)
│       │
│       ├── impersonation/          # Impersonation feature module
│       │   ├── schema.sql          # Module-scoped database schema
│       │   ├── constants.js        # Policy enums (BLOCKED / PROTECTED / etc.)
│       │   ├── index.js            # Module export aggregator
│       │   │
│       │   ├── commands/           # Slash commands for this module
│       │   │   ├── impersonate.js          # /impersonate
│       │   │   └── impersonate-control.js  # /impctl – manage policies
│       │   │
│       │   └── logic/              # Internal logic
│       │       ├── access.js       # Mutation API (add/remove policies)
│       │       ├── rules.js        # Query API (isBlocked/isProtected)
│       │       ├── payload.js      # Webhook message payload creator
│       │       └── webhook.js      # Webhook impersonation sender
│       │
│       └── modulectl/              # Module configuration/control module
│           ├── index.js
│           ├── commands/
│           │   └── logchannel.js   # /logchannel set|unset <module> [channel]
│           └── logic/              # (reserved for future config helpers)

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

