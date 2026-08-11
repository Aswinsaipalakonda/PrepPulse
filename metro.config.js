const { getDefaultConfig } = require('expo/metro-config');
const crypto = require('crypto');
const fs = require('fs');

// Patch metro-file-map TreeFS prototype so SHA-1 calculation never throws for virtual or un-watched modules
try {
  const TreeFS = require('metro-file-map/src/lib/TreeFS').default || require('metro-file-map/src/lib/TreeFS');
  if (TreeFS && TreeFS.prototype) {
    const origTreeFSGetSha1 = TreeFS.prototype.getOrComputeSha1;
    TreeFS.prototype.getOrComputeSha1 = async function (mixedPath) {
      try {
        const res = await origTreeFSGetSha1.call(this, mixedPath);
        if (res && res.sha1) return res;
      } catch (e) {}

      try {
        if (typeof mixedPath === 'string' && fs.existsSync(mixedPath)) {
          const content = fs.readFileSync(mixedPath);
          const sha1 = crypto.createHash('sha1').update(content).digest('hex');
          return { sha1 };
        }
      } catch (err) {}

      return { sha1: '0000000000000000000000000000000000000000' };
    };
  }
} catch (e) {
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







