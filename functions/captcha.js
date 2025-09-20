const {CaptchaGenerator} = require('captcha-canvas');
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
  if (!text) throw new Error("You didn't provide ")
}
