#!/bin/bash

# Constants
SERVER_DEPLOY_PATH="/opt/P-Brain.ai"
CLIENT_DEPLOY_PATH="/opt/P-Brain.ai-client"

# Start Server
cd "$SERVER_DEPLOY_PATH" 
sudo npm start > server.log &

# Start Client
cd "$CLIENT_DEPLOY_PATH" 
sudo npm start
