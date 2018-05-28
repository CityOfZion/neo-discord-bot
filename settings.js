module.exports = {
  botToken: '<PUT_TOKEN_HERE>',
  marketPriceChannel: '<PUT_CHANNEL_ID_HERE>',
  reportChannel: '<PUT_CHANNEL_ID_HERE>',
  ownersId: '<PUT_MEMBER_ID_HERE>', // example: 'ID' (string) or ['ID1', 'ID2'] (array)
  botPrefix: '<PUT_BOT_PREFIX_HERE>', // example: '!'
  autoReconnect: true,
  unknownCommandResponse: false, // if unknown command was triggered, let user know about it
  disableEveryone: true // bot will never trigger @everyone
};
