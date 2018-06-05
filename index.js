const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');
const {
  botToken,
  autoReconnect,
  ownersId,
  botPrefix,
  unknownCommandResponse,
  disableEveryone,
  marketPriceCommand
} = require('./settings');
const { deleteMsg, fetchCoinDict } = require('./helpers');
const marketUpdates = require('./imports/market-price-updates');
const client = new CommandoClient({
  autoReconnect: autoReconnect,
  owner: ownersId,
  commandPrefix: botPrefix,
  unknownCommandResponse: unknownCommandResponse,
  disableEveryone: disableEveryone
});

const startBot = () => {
  client
    .on('ready', async () => {
      console.log(
        `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${
          client.user.id
        })`
      );

      await fetchCoinDict();

      const priceChannel = client.channels.get(marketPriceCommand.marketPriceChannel);

      await marketUpdates(priceChannel);
    })
    .on('error', console.error)
    .on('warn', console.warn)
    .on('message', message => {
      const isCommand = message.content.startsWith(botPrefix);

      if (isCommand) {
        const allCommands = client.registry.commands;
        allCommands.forEach(async cmd => {
          if (message.content.startsWith(botPrefix + cmd.name)) {
            await deleteMsg(message);
          }
        });
      }
    })
    .on('disconnect', () => console.warn('Disconnected'))
    .on('reconnect', () => console.warn('Reconnected'))
    .on('commandRun', (cmd, promise, msg, args) =>
      console.info(
        `User ${msg.author.tag} (${msg.author.id}) executed command command ${cmd.memberName}`
      )
    )
    .on('commandError', (cmd, err) =>
      console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
    );

  client.registry
    .registerDefaultTypes()
    .registerGroups([['general', 'General'], ['neo-related', 'Related to NEO']])
    .registerDefaultGroups()
    .registerDefaultCommands({
      help: false,
      eval: false
    })
    .registerCommandsIn(path.join(__dirname, 'imports', 'commands'));

  client
    .setProvider(sqlite.open(path.join(__dirname, 'db.sqlite3')).then(db => new SQLiteProvider(db)))
    .catch(console.error);

  client.login(botToken);
};

startBot();
