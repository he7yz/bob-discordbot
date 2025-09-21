const {CaptchaGenerator} = require('captcha-canvas'); //need to install package beforehand via. npm
const {
  Events,
  AttachmentBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionCollector,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js'); 

async function captcha(text, toReply, author) {
  if (!text) throw new Error("You didn't provide any text. Use `random` for a random string: captcha(text, toReply, author)");
  if (!toReply) throw new Error("You didn't provide a valid method to reply to: captcha(text, toReply {either message/interaction obj.}, author)");
  if (!author) throw new Error("You didn't provide a valid USER component: captcha(text, toReply, author);");
  
  var output = false;

  var capText = "";
  if (text.toLowerCase() == "random") {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    var outputString = "";
    for (let i = 0; i < 10; i++) {
      outputString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    capText =outputString;
  } else capText =text;

  const captcha = new CaptchaGenerator()
  .setDimension(150,450)
  .setCaptcha({ text: capText, size: 60, color: "green"})
  .setDecoy({ opacity: 0.5})
  .setTrace({ color: "green"})
  .generateSync()

  const captchaBuffer = Buffer.from(captcha);
  const attacment = new AttachmentBuilder(captchaBuffer, { name: "captcha.png"});

  const embed = new EmbedBuilder()
  .setColor("Blurple")
  .setImage('attachment://captcha.png')
  .setDescription(`⚠️ ${author}, you must solve the captcha to get access into MMUCraft! (case-sensitive)`);

  const button = new ActionRowBuilder()
  .setComponents(
    new ButtonBuilder()
    .setCustomId('captchabutton')
    .setLabel(`💭 Solve`)
    .setStyle(ButtonStyle.Danger),
  );

  var msg = await toReply.channel.send({ 
    embeds: [embed],
    files: [attachment],
    components: [button],
    ephemeral: true
  });

  const collector = new InteractionCollector(toReply.client, { message: msg, time 600000});
  const modalCollector = new InteractionCollector(toReply.client);

  collector.on("collect", async i => {
    if (i.customId == "captchabutton"){
      if (author !== i.user ) return await i.reply({ content: `⚠️ Only ${author.username} can use this.`, ephemeral = true});

      const capModal = new ModalBuilder()
      .setTitle("Verify Your Captcha Answer")
      .setCustomId(`captchamodal`);

      const answer = new TextInputBuilder()
      .setCustomId("captchaanswer")
      .setLabel("Your Captcha Answer")
      .setPlaceholder("Submit the captcha given. If you got it wrong, skill issue lol.")
      .setStyle(TextInputStyle.Short);

      const row = new ActionRowBuilder().addComponents(answer);
      capModal.addComponents(row);
      await i.showModal(capModal);

      modalCollector.on('collect', async mI =>{
        if (mI.customId !== "captchamodal") return;
        const respondAns = mI.fields.getTextInputValue("captchaanswer");

        if (respondAns != capText) {
          return await mI.reply({ content: `⚠️ That was wrong! Try again`, ephemeral = true}).catch(err => {});
        } else {
          await mI.reply({ content: `🌐 You have sucessfully passed the Captcha Verification.`, ephemeral = true }).catch(err => {});
          await msg.delete().catch(err => {});
        }
      });
    }
  });

  while (!output) {
    await new Promise(resolve => setTimeout(resolve,100 ));
  }
  await toReply.client.cache.set(`${toReply.id}`, true);
  await modalCollector.stop();
  await collector.stop();
};

module.exports = captcha;
