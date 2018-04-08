const request = require('async-request');
const currency = require('currency-formatter');

async function sendUpdate(c) {
  try {
    console.log('GET MARKET PRICE!!!');
  
    const neoUSDPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=NEOUSDT');
  
    const neoBTCPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=NEOBTC');
  
    const gasBTCPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=GASBTC');

    const ontBTCPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=ONTBTC');
  
    const btcUSDPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=BTCUSDT');
  
    const neoUSDPrice = JSON.parse(neoUSDPriceRaw.body);
  
    const neoBTCPrice = JSON.parse(neoBTCPriceRaw.body);
  
    const gasBTCPrice = JSON.parse(gasBTCPriceRaw.body);
  
    const ontBTCPrice = JSON.parse(ontBTCPriceRaw.body);
  
    const btcUSDPrice = JSON.parse(btcUSDPriceRaw.body);
    
    const gasUSDPrice = parseFloat(gasBTCPrice.lastPrice) * parseFloat(btcUSDPrice.lastPrice);
    const ontUSDPrice = parseFloat(ontBTCPrice.lastPrice) * parseFloat(btcUSDPrice.lastPrice);
    const gasToNeoPriceRatio = (gasUSDPrice / neoUSDPrice.lastPrice * 100).toFixed(2);
    const ontToNeoPriceRatio = (ontUSDPrice / neoUSDPrice.lastPrice * 100).toFixed(2);
  
    let msg = '';
    msg += `NEO ${currency.format(neoUSDPrice.lastPrice, {code: 'USD'})} (B${neoBTCPrice.lastPrice})`;
    msg += ` - GAS ${currency.format(gasUSDPrice, {code: 'USD'})} (B${gasBTCPrice.lastPrice})`;
    msg += ` - G/N RATIO: ${gasToNeoPriceRatio}%`;
    msg += ` - ONT ${currency.format(ontUSDPrice, {code: 'USD'})} (B${ontBTCPrice.lastPrice})`;
    msg += ` - O/N RATIO: ${ontToNeoPriceRatio}%`;
    msg += ` - B ${currency.format(btcUSDPrice.lastPrice, {code: 'USD'})}`;
    msg += `\n`;
    msg += `---------\n`;
    msg += `==TRUMP==\n`;
    msg += `---------\n`;
    msg += `ONT ${currency.format(ontUSDPrice, {code: 'USD'})} (B${ontBTCPrice.lastPrice})`;
    msg += ` - O/N RATIO: ${ontToNeoPriceRatio}%`;
  
    console.log(msg);
  
    c.send(msg);
  } catch(e) {
    console.log('ERROR', e.message);
  }
}

module.exports = async (channel) => {
  await sendUpdate(channel);
  setInterval(async (c) => {
    await sendUpdate(c);
  }, 200000, channel);
};