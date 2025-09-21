require('dotenv').config();

const Discord = require("discord.js");
const client = new Discord.Client({intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildPresences, // this intent fixes the userCount issue :)
]});

client.cooldowns = new Map();
client.cache = new Map();

require('./utilities/ComponentsLoader.js')(client);
require('./utilities/SlashCommands.js')(client);
console.log(process.env); //just for debugging, remove if needed

client.once("clientReady", () => {
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

client.login(process.env.BOB_TOKEN);
