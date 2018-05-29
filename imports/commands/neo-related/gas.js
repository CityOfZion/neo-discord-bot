const { Command } = require('discord.js-commando');
const request = require('request');
const currency = require('currency-formatter');

module.exports = class GasCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gas',
      group: 'neo-related',
      memberName: 'gas',
      description: 'Shows more details for GAS using CoinMarketCap.',
      examples: ['!gas'],
      guildOnly: false
    });
  }

  async run(message) {
    request.get(
      {
        url: 'https://api.coinmarketcap.com/v1/ticker/GAS/?convert=USD',
        json: true
      },
      function(e, r, prices) {
        const price = prices[0];
        message.channel.send(
          `current GAS price = ${currency.format(price.price_usd, { code: 'USD' })}, B${
            price.price_btc
          } (CoinMarketCap)`
        );
      }
    );
  }
};
