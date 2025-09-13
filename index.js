const Discord = require("discord.js")
const client = new Discord.Client({intents: [ // new discord gateway intents
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent
]})

client.once("ready", () => { //ready is deprecated, uses clientReady now
  console.log(`${client.user.tag} is up and ready!`)
});

client.on("messageCreate", (message) =>{ //message is also deprecated, uses messageCreate now..
  if (message.content === 'sudo ping') {
    message.channel.send("Pinging ...")
      // console.log(`Sending Ping...`)
      .then((msg) => {
        msg.edit("Pong: " + (Date.now() - msg.createdTimestamp) + "ms")
      });
  }
})

client.login(bob_token);
