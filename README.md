# Bytesize Image Stitcher

Takes a png sequence in the input folder and stitches it into one image in the build folder.

The After Effects file is in the after_effects folder, which can be used to create a PNG sequence animation.

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
