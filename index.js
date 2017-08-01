const Discord = require("discord.js");
const client = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const Bot = require('./bot');

MongoClient.connect('YOUR_MONGO_DATABASE_URL', function (err, db) {
  console.log("Connected correctly to server");
  
  const discordBot = new Bot(db, client, 'YOUR_BOT_API_KEY');
  discordBot.init();
  
});