const { Command } = require('discord.js-commando');
const request = require('request');
const currency = require('currency-formatter');

module.exports = class PricesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prices',
      group: 'neo-related',
      memberName: 'prices',
      description: 'Shows more details for NEO using Binance, Bittrex and Yunbi.',
      examples: ['!prices'],
      guildOnly: false
    });
  }

  async run(message) {
    request.get(
      {
        url: 'https://www.binance.com/api/v1/ticker/24hr?symbol=NEOBTC',
        json: true
      },
      function(e, r, bnbprice) {
        request.get(
          {
            url: 'https://bittrex.com/api/v1.1/public/getticker?market=btc-neo',
            json: true
          },
          function(e, r, bitprice) {
            request.get(
              {
                url: 'https://yunbi.com/api/v2/tickers/anscny.json',
                json: true
              },
              function(e, r, yunbiprice) {
                request.get(
                  {
                    url: 'https://yunbi.com/api/v2/tickers/btccny.json',
                    json: true
                  },
                  function(e, r, btcyunbi) {
                    request.get(
                      {
                        url: 'https://bittrex.com/api/v1.1/public/getticker?market=usdt-btc',
                        json: true
                      },
                      function(e, r, btcprice) {
                        if (yunbiprice.ticker && btcyunbi.ticker) {
                          message.channel.send(
                            `NEO prices:\nBittrex = ${currency.format(
                              btcprice.result.Last * bitprice.result.Last,
                              { code: 'USD' }
                            )}, B${bitprice.result.Last}\nBinance = ${currency.format(
                              btcprice.result.Last * bnbprice.lastPrice,
                              { code: 'USD' }
                            )}, B${bnbprice.lastPrice}\nYunbi = ${currency.format(
                              btcprice.result.Last *
                                (yunbiprice.ticker.last / btcyunbi.ticker.last),
                              { code: 'USD' }
                            )}, B${yunbiprice.ticker.last / btcyunbi.ticker.last}`
                          );
                        } else {
                          message.channel.send(
                            `NEO prices:\nBittrex = ${currency.format(
                              btcprice.result.Last * bitprice.result.Last,
                              { code: 'USD' }
                            )}, B${bitprice.result.Last}\nBinance = ${currency.format(
                              btcprice.result.Last * bnbprice.lastPrice,
                              { code: 'USD' }
                            )}, B${bnbprice.lastPrice}`
                          );
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
};
