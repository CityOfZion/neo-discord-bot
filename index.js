const Discord = require("discord.js");
const client = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const Bot = require('./bot');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'mongoUrl', alias: 'm', type: String },
  { name: 'apiKey', alias: 'a', type: String }
];

const {mongoUrl, apiKey} = commandLineArgs(optionDefinitions);

const startBot = function(db) {
  const discordBot = new Bot(db, client, apiKey);
  discordBot.init();
};

if(!mongoUrl) {
  startBot(false);
} else {
  MongoClient.connect(mongoUrl, function (err, db) {
    console.log("Connected correctly to MONGO server");
    startBot(db);
  });
}
