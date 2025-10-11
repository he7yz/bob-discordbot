require('dotenv').config();

const Discord = require("discord.js");
const client = new Discord.Client({intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildPresences,
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

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  
  if (!command) {
    console.log(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    
    const errorMessage = { content: '❌ There was an error executing this command!', ephemeral: true };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client.on("messageCreate", (message) =>{
  if (message.content === 'sudo ping') {
    message.channel.send("Pinging ...")
      // console.log(`Sending Ping...`)
      .then((msg) => {
        msg.edit("Pong: " + (Date.now() - msg.createdTimestamp) + "ms")
      });
  }
})

client.login(process.env.BOB_TOKEN);
