 discord-modular-bot

A modular Discord bot built with Node.js and designed for scalability. The project emphasizes clean architecture, strict separation of concerns, and runtime-loadable modules.
Every feature is isolated inside its own module. No core edits required.

# Features

- SQLite-based persistence with migration support
- Modular command and feature loading
- Support for slash commands
- Per-module log channels configurable at runtime
- Operator role system for per-module permission control
- Impersonation module (first major feature module)
- Random/Pools module —  feature module to post randomly from text pools
- Module control (`modulectl`) module for runtime configuration

### Impersonation Module

Provides a controlled impersonation system with:

- `/impersonate` — impersonate a user
<img src="https://i.imgur.com/FF3Bgj4.gif"/>

- `/impctl` — add/remove access or protection rules
  - `blocked` → user cannot use impersonation
  - `protected` → user cannot be impersonated

All impersonation actions are logged to the configured log channel for the `impersonation` module in that guild (if set).
### Random Module 
A fully modular randomizer system that allows creating text pools, modifying them, and posting random unseen items.

#### Commands
 - `/roll poolname` — Posts a random item from the specified pool.

 Items cycle: once all items have been seen, the module resets and starts over.
 Only unseen items are returned until exhausted.

- `/roll list` — Shows all available pools in the guild.
#### /rollctl — Administration commands
- `/rollctl create` - Create a new pool from a .txt attachment.
```
pool: <name>
attachment: <text file containing lines>

```
- ##### Each line becomes a pool entry. Duplicates are automatically rejected.
- `/rollctl modify` - Add or remove entries from an existing pool.
```
pool: <name>
action: add | remove
entry: <text or sentence>
```
### Reaction Module
Allows you to send reaction(s) to people to multiple people via keyword-emoji combinations.
- `/reactions control `
   - `action` → `"add"` or `"remove"` 
   - `keyword` → the keyword to trigger the reactions
   - `emoji`  → the emoji that willl be reacted to the messages (available for add)

`/reactions list` → Lists all the possible  keyword : emoji combinations

This command detects a message that starts with a keyword in the table for possible reactions, it reacts to last 20 message in chat excluding the author of the keyword trigger. Enabled only for the operators for the module specifically. Possible to target a specific person with the `keyword [target name]` combination.
    



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
  
This command writes log channel configuration to the database. Other modules (like `impersonation`) use this configuration through the core logger.

## Logging System

Logging is handled centrally in src/core:

- core/logConfig.js — stores module → channel mapping

- core/logger.js — unified interface for sending logs

- events/moduleLog.js — dispatches log events to the correct channels

Modules call it like:

```
  await logger.sendLogMessage(interaction.user,
    interaction.guildId,
    "impersonation",
     {customEmbeds : [embed] } // allows for custom embeds or a default one if left empty

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
- Recommended to run it through the pm2 daemon process manager the setup for it is also quite simple
  ```
   npm install pm2@latest -g   #install pm2
   pm2 start src/bot.js       #start the bot and it registers an instance of "bot"
   pm2 restart bot            #quick restart
   pm2 log                   #shows the runtime console for the bot
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
│
│   ├── core/
│   │   ├── db.js                   # SQLite connection + migration system
│   │   ├── schema.sql              # Core migrations table
│   │   ├── operatorConfig.js
│   │   ├── checkOperatorship.js
│   │   ├── logConfig.js
│   │   └── logger.js
│
│   ├── events/
│   │   ├── clientReady.js
│   │   ├── interactionCreate.js
│   │   └── moduleLog.js
│
│   ├── loaders/
│   │   ├── CommandLoader.js
│   │   ├── EventLoader.js
│   │   └── RegisterCommands.js
│
│   └── modules/
│       ├── index.js                # Module registry
│
│       ├── impersonation/
│       │   ├── schema.sql
│       │   ├── constants.js
│       │   ├── index.js
│       │   ├── commands/
│       │   │   ├── impersonate.js
│       │   │   └── control.js
│       │   └── logic/
│       │       ├── access.js
│       │       ├── rules.js
│       │       ├── embed.js
│       │       ├── payload.js
│       │       └── webhook.js
│
│       ├── modulectl/
│       │   ├── constants.js
│       │   ├── index.js
│       │   ├── commands/
│       │   │   ├── logchannel.js
│       │   │   └── operators.js
│       │   └── logic/
│       │       ├── access.js
│       │       └── rules.js
│
│       └── random/                 
│           ├── schema.sql
│           ├── index.js
│           ├── commands/
│           │   ├── roll.js
│           │   └── rollctl.js
│           └── logic/
│               ├── access.js
│               ├── rules.js
│               └── fileToDB.js
        └── reaction/                 
│           ├── schema.sql
│           ├── index.js
│           ├── commands/
│           │   ├── control.js
│           └── logic/
│               ├── access.js
│               ├── rules.js
│               └── reactToMessages.js

```
# Module Structure

Each module contains:

- commands/ — Slash commands

- logic/ — Internal functions (rules/access)

- schema.sql — Module-specific DB schema

- constants.js — Shared values

- index.js — Module entrypoint + metadata

Each module contains its own logic, commands, and authorization rules, making new features easy to add without modifying core code.

Example: `src/modules/impersonation`




## Status

Actively developed. More modules and examples will be added.


# License

This project is licensed under the [GNU GPLv3](https://github.com/halilkarp/discord-modular-bot/blob/main/LICENSE).

