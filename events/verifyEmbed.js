const { EmbedBuilder } = require('discord.js');

module.exports = {
  trigger: 'sudo verifyEmbed',
  execute(message) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Authenticate Your Discord Account!",
        url: "https://example.com",
        iconURL: "https://wiki.hypixel.net/images/4/43/SkyBlock_items_nether_star.gif",
      })
      .setDescription("Welcome @everyone ( ˶ˆᗜˆ˵ )\nPlease `/verify` with me to see the rest of MMUCraft community chats!\n\n***(Time Limit is 1 minute)***")
      .setImage("https://cdn.discordapp.com/attachments/1029166753311367228/1429515825546793182/verifyMMUCraft.gif?ex=68f66bdb&is=68f51a5b&hm=02190a9eb84ca9f65d39075ec9bee2c2d78eb779acfc4ababb3ae4f9c24d19d6&")
      .setColor("#ffffff")
      .setFooter({
        text: "MMUCraft Discord",
        iconURL: "https://cdn.discordapp.com/emojis/1415316601976393788.webp?size=96",
      });
    message.channel.send({ embeds: [embed] });
  }
};
