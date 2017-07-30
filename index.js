const Discord = require("discord.js");
const client = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const Bot = require('./bot');

MongoClient.connect('MONGO_URL', function (err, db) {
  console.log("Connected correctly to server");
  
  const discordBot = new Bot(db, client);
  discordBot.init();
  
});