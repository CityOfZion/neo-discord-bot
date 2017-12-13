const request = require('request');
const currency = require('currency-formatter');

module.exports = (client, message) => {
  const data = message.content.split(' ').filter((str) => str);

  if (data.length < 2) {
    message.channel.send(`Require command of the form "!coincap <COIN NAME>"`);
    return;
  }
  
  if(!data[0] || !data[1]) {
    return;
  }

  const coin = data[1].toUpperCase();
  request.get({
      url: `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=USD`,
      json: true
    },
    function (e, r, data) {
      if (Object.keys(data).length === 0) {
        message.channel.send(`Unable to find the coin ${coin}`);
      }
      
      if(!data['id']) {
        return;
      }

      const {
        price_btc,
        percent_change_24h,
        name,
        id,
        market_cap_usd,
        price_usd,
        max_supply
      } = data;

      // NOTE: If there is no BTC pair, then we calculate the price in satoshis
      const priceBtc = currency.format(price_btc || (price_usd / price_btc), { code: 'BTC', precision: 8 });
      message.channel.send(`${name} (${id})\n${currency.format(price_usd, { code: 'USD' })} (${price_btc})  +/-: ${percent_change_24h}%  Volume: ${currency.format(data['24h_volume_usd'], { code: 'USD' })}\nSupply: ${currency.format(max_supply, {})}  Market Cap: ${currency.format(market_cap_usd, { code: 'USD' })}`);
    });
};
