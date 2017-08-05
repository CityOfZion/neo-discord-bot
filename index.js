const Discord = require("discord.js");
const client = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const {mongoUrl, apiKey} = require('minimist')(process.argv.slice(2));
const Bot = require('./bot');

MongoClient.connect(mongoUrl, function(err, db) {
  console.log("Connected correctly to server");
  const discordBot = new Bot(db, client, apiKey);
  discordBot.init();
  
});