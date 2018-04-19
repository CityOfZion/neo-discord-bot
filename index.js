const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');
const fs = require('fs');
const settings = require('./settings');
const client = new CommandoClient({autoReconnect: settings.autoReconnect, owner: settings.ownersId, commandPrefix: settings.commandPrefix, unknownCommandResponse: settings.unknownCommandResponse, disableEveryone: settings.disableEveryone});

const startBot = function() {
  client
    .on('ready', () => {
      console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
      const channel = client.channels.get(settings.marketPriceChannel);
      const marketUpdates = require('./imports/market-price-updates')(channel);
    })
    .on('error', console.error)
    .on('warn', console.warn)
    .on('message', message => {
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
    })
    .on('disconnect', () => console.warn('Disconnected'))
    .on('reconnect', () => console.warn('Reconnected'))
    .on('commandRun', (cmd, promise, msg, args) => console.info(`User ${msg.author.tag} (${msg.author.id}) executed command command ${cmd.memberName}`))
    .on('commandError', (cmd, err) => console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err));

  client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'General'],
        ['neo-related', 'Related to NEO']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
      help: false
    })
    .registerCommandsIn(path.join(__dirname, 'imports', 'commands'));

  client.setProvider(
    sqlite.open(path.join(__dirname, 'db.sqlite3')).then(db => new SQLiteProvider(db))
  ).catch(console.error);

  client.login(settings.botToken);
};

startBot();