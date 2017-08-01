module.exports = function(client, message, db) {
  const ignore = db.collection('ignore');
  
  const [command, skill] = message.content.split(' ');
  
  ignore.insertOne({
    id: 'ignore|' + skill + '|' + message.author.username,
    interval: 'forever',
    skill: skill,
    dateUpdated: new Date()
  });
  
};