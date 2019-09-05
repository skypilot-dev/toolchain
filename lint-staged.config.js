const { createHash } = require('crypto');

function computeHash(stringToHash) {
  const hash = createHash('md5')
    .update(stringToHash)
    .digest('hex');
  return hash.slice(0, 8);
}

const packageName = require('./package.json').name;
const cleanPackageName = packageName
  .replace('@', '')
  .replace('/', '-');
const dirNameHash = computeHash(__dirname);
const tmpDir = `/tmp/${cleanPackageName}-${dirNameHash}`;
module.exports = {
  '*.{js,ts}': [
    'eslint',
  ],
  '*.{ts}': [
    `tsc --esModuleInterop --incremental --outDir ${tmpDir} --tsBuildInfoFile ${tmpDir}/.tsBuildInfo`,
  ],
};
