#!/bin/bash
echo "Installing P-Brain.ai dependencies..."
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y sox libsox-fmt-all swig3.0 python-pyaudio python3-pyaudio libatlas-base-dev nodejs build-essential
sudo npm install -g node-gyp
echo -ne "Done"
echo "Cloing P-Brain.ai server..."
git clone https://github.com/patrickjquinn/P-Brain.ai.git
cd P-Brain.ai
yarn 
yarn start | > p_brain_server.log &
cd ../
echo -ne "Done"
echo "Installing P-Brain client modules..."
npm install 
echo -ne "Done"
echo "Starting P-Brain RasPi client...Done"
npm start

