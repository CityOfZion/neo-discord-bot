module.exports = {
  botToken: '<PUT_TOKEN_HERE>',
  reportChannel: '<PUT_CHANNEL_ID_HERE>',
  ownersId: '<PUT_MEMBER_ID_HERE>', // example: 'ID' (string) or ['ID1', 'ID2'] (array)
  botPrefix: '<PUT_BOT_PREFIX_HERE>', // example: '!'
  autoReconnect: true,
  unknownCommandResponse: false, // if unknown command was triggered, let user know about it
  disableEveryone: true, // bot will never trigger @everyone

  marketPriceCommand: {
    marketPriceChannel: '<PUT_CHANNEL_ID_HERE>',
    updateInterval: 60000, // update each 1 minute
    smartPriceMessagesThreshold: 3, // previous message will be updated if threshold is not reached
    uniqueStringOfCommand: ' - G/N RATIO: ' // unique string which is present only in market price command
  }
};
