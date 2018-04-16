const settings = require('./settings');
const fs = require('fs');

module.exports = class Bot {
  constructor(client, botApiKey) {
    this.botApiKey = botApiKey;
    this.client = client;
  }
  
  init() {
    this.client.on('message', (message) => {
      const regex = /^(how|when|is|which|what|whose|who|whom|where|why|can)(.*)|([^.!?]+\?)/igm;
      
      const isCommand = message.content.charAt(0) === '!';
     
      if (isCommand) {
        const command = message.content.substr(1).toLocaleLowerCase().split(' ')[0];
        fs.exists(`./imports/commands/${command}.js`, exists => {
          if (exists) {
            require(`./imports/commands/${command}.js`)(this.client, message);
            message.delete()
              .then(msg => console.log(`Deleted message from ${msg.author}`))
              .catch(console.error);
          }
        });
        
      }
    });
    
    this.client.login(this.botApiKey);
    
    this.client.on('ready', () => {
      const channel = this.client.channels.get(settings.marketPriceChannel);
      const marketUpdates = require('./imports/market-price-updates')(channel);
    })
  }
};