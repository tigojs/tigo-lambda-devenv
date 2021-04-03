const DevServer = require('./src/server');
const path = require('path');
const fs = require('fs');

// read config
const CONFIG_PATH = path.resolve(__dirname, '../.tigodev.json');

let config;
if (fs.existsSync(CONFIG_PATH)) {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, { encoding: 'utf-8' }));
}

const devServer = new DevServer(config);
devServer.start();