const { getDefaultConfig } = require('expo/metro-config');
const crypto = require('crypto');
const fs = require('fs');

// Patch Metro DependencyGraph.prototype.getOrComputeSha1 so SHA-1 calculation never throws on Windows OneDrive paths
try {
  const DependencyGraph = require('metro/src/node-haste/DependencyGraph');
  if (DependencyGraph && DependencyGraph.prototype) {
    const origGetSha1 = DependencyGraph.prototype.getOrComputeSha1;
    DependencyGraph.prototype.getOrComputeSha1 = async function (mixedPath) {
      try {
        const res = await origGetSha1.call(this, mixedPath);
        if (res && res.sha1) return res;
      } catch (e) {
        // Fallback calculation directly from filesystem
      }
      try {
        if (fs.existsSync(mixedPath)) {
          const content = fs.readFileSync(mixedPath);
          const sha1 = crypto.createHash('sha1').update(content).digest('hex');
          return { sha1 };
        }
      } catch (err) {}
      return { sha1: '0000000000000000000000000000000000000000' };
    };
  }
} catch (err) {
  // Guard
}

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  events: require.resolve('events'),
};

module.exports = config;






