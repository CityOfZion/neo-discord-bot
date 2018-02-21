const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true});
const Bot = require('./bot');


const startBot = function() {
  console.log('starting bot');
  const discordBot = new Bot(client, "BOT_API_KEY");
  discordBot.init();
};

startBot();
