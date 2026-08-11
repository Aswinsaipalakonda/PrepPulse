const { getDefaultConfig } = require('expo/metro-config');
const crypto = require('crypto');
const fs = require('fs');

// Deep patch Metro internal modules to safely handle Windows OneDrive paths & missing file hashes
try {
  const DependencyGraph = require('metro/src/node-haste/DependencyGraph').default || require('metro/src/node-haste/DependencyGraph');
  if (DependencyGraph && DependencyGraph.prototype) {
    DependencyGraph.prototype.getOrComputeSha1 = async function (mixedPath) {
      try {
        if (this._fileSystem && typeof this._fileSystem.getOrComputeSha1 === 'function') {
          const res = await this._fileSystem.getOrComputeSha1(mixedPath);
          if (res && res.sha1) return res;
        }
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
} catch (err) {}

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
} catch (e) {}

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  events: require.resolve('events'),
};

module.exports = config;








