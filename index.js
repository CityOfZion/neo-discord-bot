const Discord = require("discord.js");
const client = new Discord.Client();
const Bot = require('./bot');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'apiKey', alias: 'a', type: String }
];

const {apiKey} = commandLineArgs(optionDefinitions);

const startBot = function() {
  console.log('starting bot');
  const discordBot = new Bot(client, apiKey);
  discordBot.init();
};

startBot();
