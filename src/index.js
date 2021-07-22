const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT = 72;

/**
 * Entry point for the script.
 * ByteSize takes an input image and processes it using Sharp
 * so it is an array of RGB bytes. This can then be used on a
 * microcontroller such as an ESP32 like the Adafruit Feather.
 */
async function convert(folderName) {
  const srcDir = path.join(__dirname, '..', 'input', folderName);
  const dstDir = path.join(__dirname, '..', 'animations');

  // Collect some user input about the image
  // const { dst } = await inquirer.prompt([
  //   // {
  //   //   type: 'list',
  //   //   name: 'src',
  //   //   message: 'Select an input file',
  //   //   choices: fs.readdirSync(srcDir).filter((f) => !f.startsWith('.')),
  //   // },
  //   {
  //     type: 'list',
  //     name: 'dst',
  //     message: 'Select an output file',
  //     choices: ['handover', 'sleeping', 'resting', 'sensing', 'active'],
  //   },
  // ]);

  let img = await sharp({
    create: {
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
      // noise: {
      //   type: 'gaussian',
      //   mean: 128,
      //   sigma: 30,
      // },
    },
  })
    .toFormat('png')
    .toBuffer();

  let count = 0;
  for (const f of fs.readdirSync(srcDir).filter((f) => !f.startsWith('.'))) {
    const filename = path.join(srcDir, f);
    console.log(f);
    const composite = await sharp(filename).resize(1, 72).toBuffer();
    img = await sharp(img)
      .composite([{ input: composite, left: count, top: 0 }])
      .flatten()
      .toBuffer();
    count += 1;
  }

  // validate the image size
  const metadata = await sharp(img).metadata();
  const { width, height } = metadata;
  if (width !== IMAGE_WIDTH || height !== IMAGE_HEIGHT) {
    throw Error(`Image must be exactly ${IMAGE_WIDTH}x${IMAGE_HEIGHT}. Input image dimensions: ${width}x${height}`);
  }

  /**
   * Use the sharp library to rotate the image, resize it
   * and then convert it to a buffer of bytes. Sharp is really doing
   * the heavy lifting here and making it easy for us!
   */
  const { data } = await sharp(img).flatten().rotate(90).raw().toBuffer({ resolveWithObject: true });

  /**
   * Make the output directory if it doesn't exist
   */
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  /**
   * Map the pix as 8bit integers as hexadecimal strings: 0xRR, 0xGG, 0xBB
   */
  const pix = [...data].map((d) => {
    return `0x${d.toString(16).padStart(2, 0)}`;
  });

  // Fill out a template to give us a nice cpp header file to work with.

  const template = `#ifndef ${folderName.toUpperCase()}_ANIMATION_H
#define ${folderName.toUpperCase()}_ANIMATION_H
#include <stdint.h>
uint8_t ${folderName}[${pix.length}] = {${pix.join(',')}};
#endif
`;

  /**
   * Write the template to a header file.
   */
  const dstFileName = `${folderName}.h`;
  fs.writeFileSync(path.join(dstDir, dstFileName), template);
  console.log(chalk.greenBright(`Written: ${dstFileName}`));

  const dstPreviewFileName = `${folderName}.png`;
  await sharp(img).toFile(path.join(dstDir, dstPreviewFileName));

  // Fill out a template to give us a nice cpp header file to work with.
  // const jsonFileName = `${baseName}.pin`;
  // const buf = Buffer.from(data);
  // fs.writeFileSync(path.join(dstDir, jsonFileName), buf, { encoding: 'base64' });
  // console.log(chalk.greenBright(`Written: ${jsonFileName}`));

  // const f = fs.readFileSync(path.join(dstDir, jsonFileName));
  // f.map((b) => console.log(b));
}

async function main() {
  console.log(chalk.blueBright('ByteSize'));
  await convert('active');
  await convert('celebrating');
  await convert('handover');
  await convert('resting');
  await convert('running');
  await convert('sensing');
  await convert('sleeping');
}

main().catch((e) => console.error(`${chalk.redBright('✘')} ${chalk.redBright(e.message)}`));
