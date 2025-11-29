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
'''
 4. Start the bot
```

npm start

```

# Directory Structure

```

src/
├── bot.js             # Entry point
├── BotClient.js       # Discord.js client wrapper
├── core/              # Infrastructure layer (e.g., database)
│   └── db.js
├── database/          # SQLite file and SQL migrations
├── events/            # Event handlers
├── loaders/           # Dynamic loaders (commands, events, etc.)
└── modules/           # Self-contained bot modules
    └── impersonation/ # Example module

```


Each module contains its own logic, commands, and authorization rules, making new features easy to add without modifying core code.

## Status

-Actively developed. More modules and examples will be added.

## License

```

MIT License

Copyright (c) 2025 Halil Karp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

You are free to use, modify, and distribute this project in commercial and private applications.

```
