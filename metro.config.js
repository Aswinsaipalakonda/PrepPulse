const { getDefaultConfig } = require('expo/metro-config');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Patch Metro's internal DependencyGraph prototype so computeSha1 never throws on nested node_modules
try {
  const DependencyGraph = require('metro/src/node-haste/DependencyGraph');
  if (DependencyGraph && DependencyGraph.prototype) {
    const originalGetSha1 = DependencyGraph.prototype.getOrComputeSha1;
    DependencyGraph.prototype.getOrComputeSha1 = function (filePath) {
      try {
        if (!fs.existsSync(filePath)) {
          return '0000000000000000000000000000000000000000';
        }
        const content = fs.readFileSync(filePath);
        return crypto.createHash('sha1').update(content).digest('hex');
      } catch (err) {
        return '0000000000000000000000000000000000000000';
      }
    };
  }
} catch (e) {
  // Fallback if internal module location changes
}

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  events: require.resolve('events'),
};

module.exports = config;





