const axios = require('axios');
const currency = require('currency-formatter');
const { marketPriceCommand } = require('../settings');
const {
  incrementPriceChannelMsgCount,
  getPriceChannelMsgCount,
  resetPriceChannelMsgCount
} = require('../helpers');

async function sendUpdate(c) {
  try {

    const lastPriceChannelMsgs = await c.fetchMessages({
      limit: marketPriceCommand.smartPriceMessagesThreshold
    });

    let lastBotMessage = false;

    await lastPriceChannelMsgs.every(msg => {
      if (!msg.content.includes(marketPriceCommand.uniqueStringOfCommand)) {
        incrementPriceChannelMsgCount();
        return true;
      } else {
        if(lastBotMessage === false) lastBotMessage = msg;
        return false;
      }
    });

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

    let msgToSend = '';
    msgToSend += `NEO ${currency.format(neoUSDPrice.lastPrice, { code: 'USD' })} (B${
      neoBTCPrice.lastPrice
    })`;
    msgToSend += ` - GAS ${currency.format(gasUSDPrice, { code: 'USD' })} (B${
      gasBTCPrice.lastPrice
    })`;
    msgToSend += ` - G/N RATIO: ${gasToNeoPriceRatio}%`;
    msgToSend += ` - B ${currency.format(btcUSDPrice.lastPrice, { code: 'USD' })}`;

    if (getPriceChannelMsgCount() > marketPriceCommand.smartPriceMessagesThreshold) {
      const sentMessage = await c.send(msgToSend);
      console.log(`Market price sent with new message: ${sentMessage.content}`);
      resetPriceChannelMsgCount();
    } else {
        const editedMsg = await lastBotMessage.edit(msgToSend);
        console.log(`Market price updated in previous message: ${editedMsg.content}`);
        resetPriceChannelMsgCount();
    }
  } catch (e) {
    console.log('ERROR', e.message);
    await resetPriceChannelMsgCount();
  }
}

module.exports = async channel => {
  await sendUpdate(channel);
  setInterval(
    async c => {
      await sendUpdate(c);
    },
    marketPriceCommand.updateInterval,
    channel
  );
};
