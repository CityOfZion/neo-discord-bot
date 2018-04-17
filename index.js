const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true});
const Bot = require('./bot');
const settings = require('./settings');


const startBot = function() {
  console.log('starting bot');
  const discordBot = new Bot(client, settings.botToken);
  discordBot.init();
};

startBot();
