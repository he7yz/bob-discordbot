const {SlashCommandBuilder} = require('discord.js');
const captcha = require('./functions/captcha.js');

module.exports = {
  data : new SlashCommandBuilder()
  .setName('captchatest')
  .setDescription('Captcha Testing'),
  async execute (interaction) {
    
    await interaction.reply({ content: `🌐 Captcha Interaction Testing`, ephemeral = true});

    await captcha("random", interaction, interaction.user);

    var cache = interaction.client.cache.get(interaction.id);
    while (!cache){
      cache = await interaction.client.cache.get(interaction.id);
      await new Promise(resolve => setTimeout(resolve,1000));
    }
    await interaction.client.cache.delete(interaction.id);
    await interaction.editReply("✅ Approved from Captcha :D");

    const member = await message.guild.members.fetch(message.author.id);
    await member.roles.add("1415363731176554648"); // PLAYER role auto add

    await interaction.reply("Welcome To MMUCraft!");

  }
}
