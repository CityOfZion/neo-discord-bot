const request = require('request');
const currency = require('currency-formatter');

module.exports = (client, message) => {
  const data = message.content.split(' ').filter((str) => str);

  if (data.length < 2) {
    message.channel.send(`Require command of the form "!coincap <COIN NAME>"`);
  }

  const coin = data[1].toUpperCase();
  request.get({
      url: `http://coincap.io/page/${coin}`,
      json: true
    },
    function (e, r, data) {
      if (Object.keys(data).length === 0) {
        message.channel.send(`Unable to find the coin ${coin}`);
      }

      const {
        btcPrice,
        cap24hrChange,
        display_name,
        id,
        market_cap,
        price_btc,
        price_usd,
        supply,
        volume,
      } = data;

      // NOTE: If there is no BTC pair, then we calculate the price in satoshis
      const priceBtc = currency.format(price_btc || (price_usd / btcPrice), { code: 'BTC', precision: 8 });
      message.channel.send(`${display_name} (${id})\n${currency.format(price_usd, { code: 'USD' })} (${priceBtc})  +/-: ${cap24hrChange}%  Volume: ${currency.format(volume, { code: 'USD' })}\nSupply: ${currency.format(supply, {})}  Market Cap: ${currency.format(market_cap, { code: 'USD' })}`);
    });
};
