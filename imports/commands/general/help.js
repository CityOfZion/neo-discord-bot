const { Command } = require('discord.js-commando');

module.exports = class HelpCommand extends Command {
  constructor(client) {
      super(client, {
          name: 'help',
          group: 'general',
          memberName: 'help',
          description: 'Displays more details about bot and commands available.',
          examples: ['!help', '!help prefix'],
          guildOnly: false,
      });
  }

  async run(message) {
    message.channel.send('https://github.com/CityOfZion/neo-discord-bot\n\navailable commands: neo, summary, prices, change, gas, coincap', {
      file: "https://cdn-images-1.medium.com/max/800/1*JwsTfy5YZ5Y1oO3XKcJiPQ.png"
    });
  }
};
