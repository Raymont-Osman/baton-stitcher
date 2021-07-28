const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

const IMAGE_HEIGHT = 168;

/**
 * Stitch Frames
 * Takes a folder of image frames and stitches them into one image using Sharp
 * @param {string} srcDir
 */
async function stitchFrames(srcDir) {
  /**
   * Setup the src and destination folders within the repository
   */
  const dstDir = path.join(__dirname, '..', 'build');
  /**
   * Read the directory to get the input images
   */
  const srcImages = fs.readdirSync(srcDir).filter((f) => !f.startsWith('.'));

  /**
   * Make a base composite png image
   */
  let img = await sharp({
    create: {
      width: srcImages.length,
      height: IMAGE_HEIGHT,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
    },
  })
    .toFormat('png')
    .toBuffer();

  /**
   * Iterate through the folder and slap one image next to the other
   * in a composite image, 1 pixel apart
   */
  let count = 0;
  for (const f of srcImages) {
    const filename = path.join(srcDir, f);
    console.log(f);
    const composite = await sharp(filename).resize(1, IMAGE_HEIGHT).toBuffer();
    img = await sharp(img)
      .composite([{ input: composite, left: count, top: 0 }])
      .flatten()
      .toBuffer();
    count += 1;
  }

  /**
   * Make the output directory if it doesn't exist
   */
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  /**
   * Save the file
   */
  const dstPreviewFileName = `${path.basename(srcDir)}.png`;
  await sharp(img).rotate(90).toFile(path.join(dstDir, dstPreviewFileName));
  console.log(chalk.green(`Completed ${path.basename(srcDir)}\n`));
}

/**
 * Prompt the user to ask which animation to convert
 */
async function getSourceDirectory() {
  const srcDir = path.join(__dirname, '..', 'input');
  /**
   * Make the input directory if it doesn't exist
   */
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  const { srcFolder } = await inquirer.prompt([
    {
      type: 'list',
      name: 'srcFolder',
      message: 'Select an input animation',
      choices: fs.readdirSync(srcDir).filter((f) => !f.startsWith('.')),
    },
  ]);
  return path.join(srcDir, srcFolder);
}

/**
 * Entry point for the script.
 * ByteSize takes a folder of input image frames from After Effects and stitches it
 * together using Sharp. It can also output an array of RGB bytes in a header file,
 * which can then be used on a
 * microcontroller such as an ESP32 like the Adafruit Feather.
 */
async function main() {
  while (true) {
    const srcDir = await getSourceDirectory();
    console.log(srcDir);
    await stitchFrames(srcDir);
  }
}

main().catch((e) => console.error(`${chalk.redBright('✘')} ${chalk.redBright(e.message)}`));
