const { Command } = require('discord.js-commando');
const axios = require('axios');
const currency = require('currency-formatter');
const { getCoin } = require.main.require('./helpers');

module.exports = class CoincapCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coincap',
      group: 'general',
      memberName: 'coincap',
      description: 'Shows more details for provided coin using CoinMarketCap.',
      examples: ['!coincap <COIN NAME>'],
      guildOnly: false
    });
  }

  async run(message) {
    const usersCoinInput = message.content.split(' ')[1];

    if (!usersCoinInput) {
      message.channel.send(`Require command of the form "!coincap <COIN NAME>"`);
      return;
    }

    const requestedCoin = getCoin(usersCoinInput);

    if (!requestedCoin) {
      // message.channel.send('Unable to find provided coin');
      return;
    }

    try {
      const coinTicker = await axios(
        `https://api.coinmarketcap.com/v1/ticker/${requestedCoin.website_slug}/?convert=USD`
      );

      if (!coinTicker || !coinTicker.data[0]) {
        // message.channel.send('Unable to find provided coin');
        return;
      }

      const coinData = coinTicker.data[0];

      const priceBtc = coinData.price_btc;
      const percentChange24h = coinData.percent_change_24h;
      const volumeUsd24h = coinData['24h_volume_usd'];
      const name = coinData.name;
      const id = coinData.id;
      const marketCapUsd = coinData.market_cap_usd;
      const priceUsd = coinData.price_usd;
      const maxSupply = coinData.max_supply;

      message.channel.send(
        `${name} (${id})\n${currency.format(priceUsd, {
          code: 'USD'
        })} (${priceBtc})  +/-: ${percentChange24h}%  Volume: ${currency.format(volumeUsd24h, {
          code: 'USD'
        })}\nSupply: ${currency.format(maxSupply, {})}  Market Cap: ${currency.format(
          marketCapUsd,
          {
            code: 'USD'
          }
        )}`
      );
    } catch (err) {
      console.error(err);
    }
  }
};
