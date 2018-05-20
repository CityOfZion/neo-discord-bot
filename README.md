<p align="center">
  <img 
    src="http://res.cloudinary.com/vidsy/image/upload/v1503160820/CoZ_Icon_DARKBLUE_200x178px_oq0gxm.png" 
    width="125px"
  >
</p>

<h1 align="center">NEO Discord Bot</h1>

<p align="center">
  Discord bot made for NEO community.
</p>

## Description
This bot is specially made for the NEO (previously ANS) Discord server. Its purpose is to provide a multitude of functionality for new and seasoned members. Its primary function is to respond to certain text in channels by sending the user a message with information, such as "The current GAS price is $10, B$0.00001 and rank 5". <!--did I copy that correctly? Adding to that, maybe a list of current possible commands would be at place here?-->

## Modules
You can use the discord api methods listed [here](https://discord.js.org/#/docs/main/stable/general/welcome) and commando methods listed [here](https://discord.js.org/#/docs/commando/master/general/welcome):

- `client` is the client is Discord client
- `message` is the message object

To write extra modules please take a look at the `imports/commands` folder.
You can also find documentation about writing extra modules, [here](https://github.com/discordjs/Commando-guide/blob/master/making-your-first-command.md).
```
const { Command } = require('discord.js-commando');
const request = require('request');
const currency = require('currency-formatter');

module.exports = class NeoCommand extends Command {
  constructor(client) {
      super(client, {
          name: 'neo',
          group: 'neo-related',
          memberName: 'neo',
          description: 'Shows more details for NEO using CoinMarketCap.',
          examples: ['!neo'],
          guildOnly: false,
      });
  }

  async run(message) {
    request.get({
        url: 'https://api.coinmarketcap.com/v1/ticker/neo/?convert=USD',
        json: true
      },
      function (e, r, prices) {
        const price = prices[0];
        message.channel.send(`current NEO price = ${currency.format(price.price_usd, { code: 'USD' })}, B${price.price_btc} (CoinMarketCap)`);
      });
  }
};
```

## How to setup
 - Clone this repository
 - In the directory where it's located do `yarn install`
 - Change the values in settings.js to your own values
 - Run the bot with `yarn start` (if you don't want to use pm2, you can use `node --harmony index.js`)

## Settings explanation
 - `botToken` - Sets token of Discord bot.
 - `marketPriceChannel` - Market price details are posted on this channel.
 - `reportChannel` - Report details are posted on this channel after reporting a user.
 - `ownersId` - Specifies which users has admin rights for bot - [command list for admins](https://github.com/discordjs/Commando/blob/master/docs/commands/builtins.md), [more details about user permissions](https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/checking-for-user-permissions.html).
 - `botPrefix` - Sets custom prefix for all commands.
 - `autoReconnect` - Automatically reconnects the bot in case of connection issues.
 - `unknownCommandResponse` - If bot doesn't recognize specified command, it will send a message about it (with reference to `help` command).
 - `disableEveryone` - Filters out all messages sent by bot and always removes `@everyone` mention.

## Roadmap

### Release 0.1
- [x] Modular system
- [x] Initial modules
- [x] Text recognition
- [x] Remove command when said

### Release 0.2
- [x] Respond privately
- [x] Add ignore feature

### Release 0.3
- [ ] More modules
