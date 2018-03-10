const request = require('async-request');
const currency = require('currency-formatter');

async function sendUpdate(c, retrieveLastMessage) {
  try {
    console.log('GET MARKET PRICE!!!');
  
    const neoUSDPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=NEOUSDT');
  
    const neoBTCPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=NEOBTC');
  
    const gasBTCPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=GASBTC');
  
    const btcUSDPriceRaw = await request('https://binance.com/api/v1/ticker/24hr?symbol=BTCUSDT');
  
    const neoUSDPrice = JSON.parse(neoUSDPriceRaw.body);
  
    const neoBTCPrice = JSON.parse(neoBTCPriceRaw.body);
  
    const gasBTCPrice = JSON.parse(gasBTCPriceRaw.body);
  
    const btcUSDPrice = JSON.parse(btcUSDPriceRaw.body);
    
    
    const gasUSDPrice = parseFloat(gasBTCPrice.lastPrice) * parseFloat(btcUSDPrice.lastPrice);
    const gasToNeoPriceRatio = (gasUSDPrice / neoUSDPrice.lastPrice * 100).toFixed(2);
  
    let msg = '';
    msg += `NEO ${currency.format(neoUSDPrice.lastPrice, {code: 'USD'})} (B${neoBTCPrice.lastPrice})`;
    msg += ` - GAS ${currency.format(gasUSDPrice, {code: 'USD'})} (B${gasBTCPrice.lastPrice})`;
    msg += ` - G/N RATIO: ${gasToNeoPriceRatio}%`;
    msg += ` - B ${currency.format(btcUSDPrice.lastPrice, {code: 'USD'})}`;
  
    console.log(msg);

    const lastMessage = retrieveLastMessage();

    if (lastMessage.author.bot) {
      console.log('Deleting last message, as it was a price update')
      lastMessage.delete();
    }
  
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