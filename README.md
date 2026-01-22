# Buried Giant Studios Bot

A bot made for the Buried Giant Studios Discord.

## Environment Variables

Put these values in a [`.env`](https://www.npmjs.com/package/dotenv) file.

### Required

- `DISCORD_TOKEN` - the Discord token for the bot.

### Optional

- `DISCORD_SERVER_ID` - the Discord server id for specific testing
- `DISCORD_CLIENT_ID` - the Discord client id for specific testing

## Development

- `npm run start:dev`

### Building

You don't need to build the app to deploy it. Just use ts-node, it's not that intensive.

## Docker

We use Docker to deploy this bot, and you can too. Use `docker pull ghcr.io/buriedgiantstudios/bgsbot:edge` to get the latest image
