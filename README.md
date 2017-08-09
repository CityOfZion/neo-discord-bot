# NEO Discord Bot

## Description
This bot is specially made for the Antshares/NEO Discord server. It's purpose is to provide a multitude of functionality for new and seasoned members. It's primary function is to respond to certain text in channels and send the user a message with information.

## Modules
You can use the discord api methods listed here: https://discord.js.org/#/docs/main/stable/general/welcome

- `client` is the client is Discord client
- `message` is the message object

To write extra modules please take a look at the `imports/commands` folder.
```
const request = require('request');
const currency = require('currency-formatter');

// Export the module so it can be imported
module.exports = (client, message) => {
// Get the url and give back a json result
  request.get({
      url: 'https://api.coinmarketcap.com/v1/ticker/neo/?convert=USD',
      json: true
    },
    function (e, r, prices) {
      const price = prices[0];
      // Send a message to the channel
      message.channel.send(`The current NEO price is ${currency.format(price.price_usd, { code: 'USD' })}, B${price.price_btc} and rank ${price.rank}`);
    });
};
```

## How to setup
 - Clone this repository
 - In the directory where it's located do `npm install`
 - Run the bot with `node index --mongoUrl "url_here" --apiKey "your_discord_api_key"` (mongoUrl is optional!)

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
