const Discord = require("discord.js")
const client = new Discord.Client({intents: [ // new discord gateway intents
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers
]})

client.once("ready", () => { //ready is deprecated, uses clientReady now
  console.log(`${client.user.tag} is up and ready!`);

  //discordRPC status (WIP)
  const userCount = client.users.cache.size;
  
  client.user.setActivity({
    name:`${userCount} Players in MMUCraft`,
    type: Discord.ActivityType.Watching,
    state: "minecraft.mmu.edu.my",
    details: "MMUCraft",
  });    
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
