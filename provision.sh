#!/bin/bash

# Constants
SERVER_DEPLOY_PATH="/opt/P-Brain.ai"
CLIENT_DEPLOY_PATH="/opt/P-Brain.ai-client"

# Get Latest Code
git pull https://github.com/patrickjquinn/P-Brain.ai-RasPi.git

# Dependencies
echo "Installing P-Brain.ai dependencies..."
sudo apt-get update
sudo apt-get install -y sox libsox-fmt-all swig3.0 python-pyaudio python3-pyaudio libatlas-base-dev nodejs build-essential
sudo npm install -g node-gyp
pip install pyaudio

# Deploy
killall -KILL node
echo -ne "Done"
echo "Cloing P-Brain.ai server..."
rm -rf P-Brain.ai
rm -rf node_modules
sudo rm -rf "$CLIENT_DEPLOY_PATH"
sudo mkdir "$CLIENT_DEPLOY_PATH"
sudo cp -R ./* "$CLIENT_DEPLOY_PATH/"
git clone https://github.com/patrickjquinn/P-Brain.ai.git
sudo rm -rf "$SERVER_DEPLOY_PATH"
sudo mkdir "$SERVER_DEPLOY_PATH"
sudo cp -R ./P-Brain.ai/* "$SERVER_DEPLOY_PATH/"

# Node Dependencies
cd "$SERVER_DEPLOY_PATH"
echo "Installing P-Brain server modules..."
sudo npm install 
cd "$CLIENT_DEPLOY_PATH"
echo -ne "Done"
echo "Installing P-Brain client modules..."
sudo npm install 
echo -ne "Done"