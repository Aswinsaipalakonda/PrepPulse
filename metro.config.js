const { getDefaultConfig } = require('expo/metro-config');
const crypto = require('crypto');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

// Override Metro SHA-1 getter to handle nested OneDrive file paths reliably on Windows
config.serializer = config.serializer || {};
config.serializer.getSha1 = (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('sha1').update(buffer).digest('hex');
  } catch (e) {
    return '0000000000000000000000000000000000000000';
  }
};

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  events: require.resolve('events'),
};

module.exports = config;




