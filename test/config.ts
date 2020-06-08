/* Designate a unique directory for this project's temporary test files */
import os from 'os';
import path from 'path';

import { name } from '../package.json';
const safePackageName = name
  .replace('@', '')
  .replace('/', '-');
export const TMP_DIR = path.resolve(os.tmpdir(), `${safePackageName}`);
