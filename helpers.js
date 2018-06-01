module.exports = {
  deleteMsg: async message => {
    if (message.channel.type !== 'dm') {
      try {
        const msg = await message.delete();
        console.log(`Deleted message from ${msg.author}`);
      } catch (err) {
        console.error(err);
      }
    }
  }
};
