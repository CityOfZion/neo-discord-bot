const axios = require('axios');
const currency = require('currency-formatter');

async function sendUpdate(c) {
  try {
    console.log('GET MARKET PRICE!!!');

    const neoUSDPriceRaw = await axios('https://binance.com/api/v1/ticker/24hr?symbol=NEOUSDT');
    const neoBTCPriceRaw = await axios('https://binance.com/api/v1/ticker/24hr?symbol=NEOBTC');
    const gasBTCPriceRaw = await axios('https://binance.com/api/v1/ticker/24hr?symbol=GASBTC');
    const btcUSDPriceRaw = await axios('https://binance.com/api/v1/ticker/24hr?symbol=BTCUSDT');

    const neoUSDPrice = neoUSDPriceRaw.data;
    const neoBTCPrice = neoBTCPriceRaw.data;
    const gasBTCPrice = gasBTCPriceRaw.data;
    const btcUSDPrice = btcUSDPriceRaw.data;

    const gasUSDPrice = parseFloat(gasBTCPrice.lastPrice) * parseFloat(btcUSDPrice.lastPrice);
    const gasToNeoPriceRatio = ((gasUSDPrice / neoUSDPrice.lastPrice) * 100).toFixed(2);

    let msg = '';
    msg += `NEO ${currency.format(neoUSDPrice.lastPrice, { code: 'USD' })} (B${
      neoBTCPrice.lastPrice
    })`;
    msg += ` - GAS ${currency.format(gasUSDPrice, { code: 'USD' })} (B${gasBTCPrice.lastPrice})`;
    msg += ` - G/N RATIO: ${gasToNeoPriceRatio}%`;
    msg += ` - B ${currency.format(btcUSDPrice.lastPrice, { code: 'USD' })}`;

    console.log(msg);

    c.send(msg);
  } catch (e) {
    console.log('ERROR', e.message);
  }
}

module.exports = async channel => {
  await sendUpdate(channel);
  setInterval(
    async c => {
      await sendUpdate(c);
    },
    200000,
    channel
  );
};
