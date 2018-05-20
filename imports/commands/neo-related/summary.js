const { Command } = require('discord.js-commando');
const request = require('request');
const currency = require('currency-formatter');

module.exports = class SummaryCommand extends Command {
  constructor(client) {
      super(client, {
          name: 'summary',
          group: 'neo-related',
          memberName: 'summary',
          description: 'Shows market summary for NEO using CoinMarketCap.',
          examples: ['!summary'],
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
      message.channel.send(`NEO market summary:\nMarket Cap = ${currency.format(price.market_cap_usd, { code: 'USD' })}\nPrice = ${currency.format(price.price_usd, { code: 'USD' })}\nCirculating Supply = ${price.available_supply}\nVolume (24h) = ${currency.format(price['24h_volume_usd'], { code: 'USD' })}\nChange (24h) = ${price.percent_change_24h}%`);
    });
  }
};