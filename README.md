# P-Brain.ai - RasPi Client

[![Join the chat at https://gitter.im/P-Brain/Lobby](https://badges.gitter.im/P-Brain/Lobby.svg)](https://gitter.im/P-Brain/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Headless Client for P-Brain.ai Virtual Assistant on Raspberry Pi

### Video Of The Client In Action

https://youtu.be/4_WPqYMKGII

## Automatic Installer (Raspberry Pi Only!)

Execute the following command on your Raspberry Pi to install P-Brain & the RasPi Client:

````
curl -sL https://raw.githubusercontent.com/patrickjquinn/P-Brain.ai-RasPi/master/raspberrypi.sh | bash
````

## Install

On Raspberry Pi (Or other Debian/Ubuntu machines) run `sudo apt-get install sox libsox-fmt-all`

Or on macOS run `brew install sox`

Clone repo, cd to its directory and type `npm install` & `npm start`

Add api info for https://wit.ai to client.js

Say `Hey Brain`, `Brain` or `Okay Brain` followed by your query (i.e `Hey Brain, What is the weather in Paris`).

