# Bytesize Image Chopper

PNG images use a complex lossless compression algorithm that is tricky to implement on c based microcontroller boards like the Arduino and ESP32 modules due to their limited resources. Bytesize, then, is a little script which takes a 150x72 pixel image and converts it to a byte array for display on an LCD screen or LED strip/matrix. The array is a long list of all the RGB pixels in the image and this can then be used on a microcontroller such as an ESP32 like the Adafruit Feather by iterating over the array. The ESP32 is particularly perfect since it has a large amount of flash storage, an AVR arduino microcontroller may be more a challenge and would only work with smaller images.

A great many improvements can be made from here, it's really super basic at the moment but the principle is that you can draw an image in photoshop and output it as an animation on an LED strip, allowing for an dazzling array of effects without hand coding.

---

## Requirements

To run the script, you will need Node.js and npm installed as a global package. Node has been used for development speed and simplicity.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version

    $ npm --version

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

### Yarn installation

You can use yarn as well as npm. To use yarn, after installing node just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/raymont-osman/bytesize
    $ cd bytesize
    $ npm install

## Configure app

Open `input/example.png` with photoshop then create your design.
Run the project with:

    $ npm start
