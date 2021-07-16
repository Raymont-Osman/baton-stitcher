const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT = 36;

const srcDir = path.join(__dirname, '..', 'input');
const dstDir = path.join(__dirname, '..', 'output');

/**
 * Entry point for the script.
 * ByteSize takes an input image and processes it using Sharp
 * so it is an array of RGB bytes. This can then be used on a
 * microcontroller such as an ESP32 like the Adafruit Feather.
 */
async function main() {
  console.log(chalk.blueBright('ByteSize'));

  // Collect some user input about the image
  const { src } = await inquirer.prompt([
    {
      type: 'list',
      name: 'src',
      message: 'Select an input file',
      choices: fs.readdirSync(srcDir).filter((f) => !f.startsWith('.')),
    },
  ]);

  const image = await sharp(path.join(srcDir, src));

  // validate the image size
  const metadata = await image.metadata();
  const { width, height } = metadata;
  if (width !== IMAGE_WIDTH || height !== IMAGE_HEIGHT) {
    throw Error(`Image must be exactly ${IMAGE_WIDTH}x${IMAGE_HEIGHT}. Input image dimensions: ${width}x${height}`);
  }

  /**
   * Use the sharp library to rotate the image, resize it
   * and then convert it to a buffer of bytes. Sharp is really doing
   * the heavy lifting here and making it easy for us!
   */
  const { data } = await image.rotate(90).raw().toBuffer({ resolveWithObject: true });

  /**
   * Map the pix as 8bit integers as hexadecimal strings: 0xRR, 0xGG, 0xBB
   */
  const pix = [...data].map((d) => {
    return `0x${d.toString(16).padStart(2, 0)}`;
  });

  // Fill out a template to give us a nice cpp header file to work with.
  const baseName = path.parse(src).name;
  const template = `#ifndef ${baseName.toUpperCase()}_ANIMATION_H
#define ${baseName.toUpperCase()}_ANIMATION_H
#include <stdint.h>
uint8_t ${baseName}[${pix.length}] = {${pix.join(',')}};
#endif
`;

  /**
   * Make the output directory if it doesn't exist
   */
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  /**
   * Write the template to a header file.
   */
  const dstFileName = `${baseName}.h`;
  const dst = path.join(dstDir, dstFileName);
  fs.writeFileSync(dst, template);
  console.log(chalk.greenBright(`Done: ${dstFileName}`));
}

main().catch((e) => console.error(`${chalk.redBright('✘')} ${chalk.redBright(e.message)}`));
