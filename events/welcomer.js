const Canvas = require('canvas');
const  { Jimp } = require('jimp');
const gifFrames = require('gif-frames');
const GIFEncoder = require('gif-encoder-2');
const sizeOf = require('image-size').default;
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const MonocraftFont = path.join(__dirname, '../fonts/Monocraft.ttf' );

if (fs.existsSync(MonocraftFont)) {
  console.log('[Welcomer] Monocraft Font Imported!', MonocraftFont);
  Canvas.registerFont(MonocraftFont, { family: 'Monocraft' });
} else {
  console.error('[Welcomer] Monocraft Font Failed to Import!!!', MonocraftFont);
}

class Welcomer {
  constructor({
    background,
    name,
    discriminator,
    avatar,
    gif,
    layer,
    blur,
    delay,
    frame_limit
  } = {}) {
    this.background = background || 'https://cdn.discordapp.com/attachments/950356441070444574/1430657693135143013/yoneyama_mai_ascii_by_helyz.gif?ex=690db10e&is=690c5f8e&hm=0f85950504d3ecb896862e9e720dcf24733de412f14924efa226c7768591ac64&'
    this.name ??= name
    this.discriminator ??= discriminator
    this.avatar ??= avatar
    this.gif ??=gif
    this.layer = layer || 'https://cdn.discordapp.com/attachments/1029166753311367228/1435910773846310963/layer.png?ex=690daf9e&is=690c5e1e&hm=6dc6836c3a09b99deebc4076acc8e57fd568b017f283df7e2381c41adb0f986f&'
    this.blur ??= blur
    this.delay = delay || 100
    this.frame_limit = frame_limit || 30
  }

  setBackground(background) {
    this.background = background
    return this;
  }

  setName(name) {
    this.name = name
    return this;
  }

  setDiscriminator(discriminator) {
    this.discriminator = discriminator
    return this;
  }

  setAvatar(avatar) {
    this.avatar = avatar
    return this;
  }

  setGif(condition){
    this.gif = condition
    return this;
  }

  setBlur(value) {
    this.blur = value
    return this;
  }

  setDelay(delay) {
    this.delay = delay
    return this;
  }

  setFrameLimit(limit){
    this.frame_limit = limit
  }

  async _getImageSize(url) {
    const data = await axios(url, {
      responseType: 'arraybuffer'
    })

    return sizeOf(data.data)
  }

  async _renderFrame(frame) {
    const canvas = Canvas.createCanvas(700,250);
    const ctx = canvas.getContext('2d');

    const scale = Math.max(canvas.width / frame.frameInfo.width, canvas.height / frame.frameInfo.height);
    const x = (canvas.width / 2) - (frame.frameInfo.width / 2) * scale;
    const y = (canvas.height / 2) - (frame.frameInfo.height / 2) * scale;

    const layer = await Canvas.loadImage(this.layer);
    let background = await Jimp.read(frame.getImage()._obj);

    background = await background.getBuffer('image/png');

    ctx.drawImage(await Canvas.loadImage(background), x, y, frame.frameInfo.width * scale, frame.frameInfo.height * scale);

    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);

    const name = this.name.length > 12 ? this.name.substring(0, 12) + '...': this.name;

    ctx.font = 'bold 36px Monocraft';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'start';
    ctx.strokeStyle = '#f7f7f7';
    ctx.fillText(`${name}`, 278, 113);

    ctx.strokeText(`$(name)`, 278, 113);

    ctx.font = `bold 25px Monocraft`;
    ctx.fillStyle = '#FFFFFF';

    ctx.fillText(`${this.discriminator}`, 278, 162.5);

    let avatar = await Jimp.read(this.avatar);

    avatar.resize({ w:1024, h:1024}).circle();
    avatar = await avatar.getBuffer('image/png');
    avatar = await Canvas.loadImage(avatar);

    ctx.drawImage(avatar, 72, 48, 150, 150);

    return ctx;
  }

  async _generateImage() {
    const img = await this._getImageSize(this.background)

    const canvas = Canvas.createCanvas(700,250);
    const ctx = canvas.getContext('2d');

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    let background = await Jimp.read(this.background);
    const layer = await Canvas.loadImage(this.layer);

    if (this.blur) background.blur (this.blur);
    background = await background.getBuffer('image/png');

    ctx.drawImage(await Canvas.loadImage(background), x, y, img.width * scale, img.height * scale);

    ctx.strokeRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(layer,0,0, canvas.width, canvas.height);

    const name = this.name.length > 12 ? this.name.substring(0, 12) + '...' : this.name;

    ctx.font = `bold 36px Monocraft`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'start';
    ctx.strokeStyle = '#f5f5f5';
    ctx.fillText(`${name}`, 278, 113);

    ctx.strokeText(`${name}`, 278, 113);

    ctx.font = `bold 25px Monocraft`;
    ctx.fillStyle = '#FFFFFF';

    ctx.fillText(`${this.discriminator}`, 278, 162.5);

    let avatar = await Jimp.read(this.avatar);

    avatar.resize({ w:1024, h:1024}).circle();
    avatar = await avatar.getBuffer('image/png');
    avatar = await Canvas.loadImage(avatar);

    ctx.drawImage(avatar, 72, 48, 150, 150);

    return canvas.toBuffer()
  }

  async generate() {
    if(!this.gif) return this._generateImage()

    const firstframe = await gifFrames({ url: this.background, frames: 0})
    const cumulative = firstframe[0].frameInfo.disposal !== 1 ? false : true;

    let data = await gifFrames({ url: this.background,frames: 'all', cumulative })
    if (data.length >= this.frame_limit) data = data.slice( 0, this.frame_limit)

    const encoder = new GIFEncoder(700, 250);
    encoder.start();
    encoder.setDelay(this.delay)

    const frames = await Promise.all(data.map(x => this._renderFrame(x)))
    for (let frame of frames) encoder.addFrame(frame)

    encoder.finish();
    return encoder.out.getData()
  }
}

module.exports = Welcomer
