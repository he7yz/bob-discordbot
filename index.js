const Discord = require("discord.js")
const client = new Discord.Client()

client.once("ready", () => {
  console.log('${client.user.tag} is up and ready!')
});

client.on("message", async message =>{
  if (message.content.startsWith("sudo ping"))
  {
    message.channel.send('Pong! Latency is ${client.ws.ping}ms')
});

client.login(bob_token);
