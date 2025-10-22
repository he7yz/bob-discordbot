module.exports = {
  channelId: '1426579012666261626',
  execute(message) {

    if (message.channel.id === this.channelId) {
      if (message.author.bot) return;

      setTimeout(() => {
        message.delete().catch(err => console.log('A message was already deleted/not found in #verify from a user.'));
      }, 5000);
    }
  }
};
