const fs = require('fs');

const path = __dirname + '/config.json';

const defaults = {
  root: __dirname + '/test'
};

let config;

try {
  config = JSON.parse(fs.readFileSync(path));
} catch (error) {
  if (error.code === 'ENOENT') {
    fs.writeFileSync(path, JSON.stringify(defaults, null, 2));
    config = defaults;
  } else {
    throw error;
  }
}

module.exports = config;
