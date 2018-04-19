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