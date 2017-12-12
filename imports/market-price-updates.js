const request = require('request');
const currency = require('currency-formatter');

function sendUpdate(c) {
  console.log('GET MARKET PRICE!!!');
  let msg = '';
  request.get({
      url: 'https://api.coinmarketcap.com/v1/ticker/NEO/?convert=USD',
      json: true
    },
    function (e, r, prices) {
      request.get({
          url: 'https://api.coinmarketcap.com/v1/ticker/GAS/?convert=USD',
          json: true
        },
        function (err, res, gasPrices) {
          if(!prices || !gasPrices) return false;
          const price = prices[0];
          const gasPrice = gasPrices[0];
          
          console.log('Price NEO: ', price.price_usd);
          console.log('Price GAS: ', gasPrice.price_usd);
          const gasToNeoPriceRatio = (gasPrice.price_usd / price.price_usd * 100).toFixed(2);
          msg += `NEO ${currency.format(price.price_usd, {code: 'USD'})} (B${price.price_btc}) - GAS ${currency.format(gasPrice.price_usd, {code: 'USD'})} (B${gasPrice.price_btc}) - G/N RATIO: ${gasToNeoPriceRatio}%`;
          c.send(msg);
        });
    });
}

module.exports = (channel) => {
  sendUpdate(channel);
  setInterval((c) => {
    sendUpdate(c);
  }, 300000, channel);
};