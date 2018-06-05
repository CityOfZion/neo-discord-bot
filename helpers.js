const axios = require('axios');
const { coinDictUpdateInterval, coinDictUrl } = require('./settings');

let priceChannelMessageCount = 0;
let coinDictionary = null;

const helpers = {
  deleteMsg: async message => {
    if (message.channel.type !== 'dm') {
      try {
        const msg = await message.delete();
        console.log(`Deleted message from ${msg.author}`);
      } catch (err) {
        console.error(err);
      }
    }
  },
  getPriceChannelMsgCount: () => {
    return priceChannelMessageCount;
  },
  incrementPriceChannelMsgCount: () => {
    priceChannelMessageCount++;
  },
  resetPriceChannelMsgCount: () => {
    priceChannelMessageCount = 0;
  },
  fetchCoinDict: async () => {
    try {
      const listings = await axios(coinDictUrl);
      const coins = listings.data.data.map(coin => {
        /* eslint-disable-next-line camelcase */
        const { id, symbol, name } = coin;
        return { id, symbol, name };
      });
      helpers.setCoinDict(coins);
    } catch (err) {
      console.error(err);
    }
  },
  setCoinDict: newDict => {
    if (newDict && newDict.length && coinDictionary !== newDict) {
      coinDictionary = newDict;
      console.log(
        `Coin dictionary has been updated successfuly - coins count: ${coinDictionary.length}`
      );
    } else if (newDict && !newDict.length) {
      console.log(`New dictionary didn't contain any coins, not updating`);
    } else if (!newDict) {
      console.log('New dictionary looks empty, not updating');
    } else {
      console.log("New dictionary didn't change, not updating");
    }
  },
  getCoinDict: () => {
    return coinDictionary;
  },
  setupCoinDict: async () => {
    await helpers.fetchCoinDict();
    setInterval(async () => {
      await helpers.fetchCoinDict();
    }, coinDictUpdateInterval);
  }
};

module.exports = helpers;
