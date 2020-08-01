#!/bin/bash
echo "starting to install..."
npm install --save-dev electron
rm package-lock.json
git clone https://github.com/arunwaran/musicPlayer.git
mv node_modules musicPlayer
cd musicPlayer
echo "Installation Finished!"
npm start
