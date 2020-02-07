/* This script copies script files to the `lib/scripts` directory for distribution. */

import fs from 'fs';
import path from 'path';

const scriptFilenames = [
  'install-husky.sh',
];

/* Resolve a path relative to the project root */
function resolvePath(relativePath = ''): string {
  const projectRoot = path.resolve(__dirname, '..');
  return path.resolve(projectRoot, relativePath);
}

const sourceDir = resolvePath('src/scripts');
const targetDir = resolvePath('lib/scripts');

fs.mkdirSync(targetDir, { recursive: true }); // `recursive` requires Node v10+

scriptFilenames.forEach((scriptFilename) => {
  const sourceFilepath = path.join(sourceDir, scriptFilename);
  const targetFilepath = path.join(targetDir, scriptFilename);
  fs.copyFileSync(sourceFilepath, targetFilepath);
});
