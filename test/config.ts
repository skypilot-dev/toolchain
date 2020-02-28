/* Designate a unique directory for this project's temporary test files */
import os from 'os';
import path from 'path';

const thisPackageName = require('../package.json').name;
const safePackageName = thisPackageName
  .replace('@', '')
  .replace('/', '-');
export const TMP_DIR = path.resolve(os.tmpdir(), `${safePackageName}`);
