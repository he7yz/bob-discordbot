require('dotenv').config();

const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');

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
// console.log(process.env);

const messageCommands = new Map();
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

let autoDeleterHandler = null;

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.trigger) {
    messageCommands.set(event.trigger, event);
  }
  if (event.channelId) {
    autoDeleterHandler = event;
  }
}

client.once("clientReady", () => {
  console.log(`${client.user.tag} is up and ready!`);

  //discordRPC status (WIP)
  const userCount = client.users.cache.size - 2;

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
    
    const errorMessage = { content: 'Error occured while executing this command.', flags: MessageFlags.Ephemeral  };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (autoDeleterHandler) {
    autoDeleterHandler.execute(message);
  }
  
  const command = messageCommands.get(message.content);
  if (command) {
    try {
      command.execute(message);
    } catch (error) {
      console.error(`Error executing ${message.content}:`, error);
    }
  }
});

client.login(process.env.BOB_TOKEN);
