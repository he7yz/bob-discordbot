module.exports = {
  trigger: 'sudo ping',
  execute(message) {
    message.channel.send("Pinging ...")
      .then((msg) => {
        msg.edit("Pong: " + (Date.now() - msg.createdTimestamp) + "ms");
      });
  }
};
