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
You can use the discord api methods listed [here](https://discord.js.org/#/docs/main/stable/general/welcome):

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
 - Run the bot with `node index --apiKey "your_discord_api_key"`

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
