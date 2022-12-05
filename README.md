# bunnyLoL
Discord bot to create and manage personal League of Legends leaderboards, as well as SoloQ Challenges.

## Getting Started

### Setting up Your Credentials

This bot works with a `config.json` file that must have the following contents:

```
{
	"clientId": <your client id>,
        "token": <your bot token>,
	"riotAPIKey": <your key for the Riot API>
}
```

### Generating the Database

To create the database file:

```
sqlite3 bunnyLoLDB.db
```

To synchronize the database with the bot:

```
node database.js
```

### Running the Bot

To run the bot:

```
node index.js
```
