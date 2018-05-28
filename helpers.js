module.exports = {
  deleteMsg: message => {
    if (message.channel.type !== 'dm') {
      message
        .delete()
        .then(msg => console.log(`Deleted message from ${msg.author}`))
        .catch(console.error);
    }
  }
};
