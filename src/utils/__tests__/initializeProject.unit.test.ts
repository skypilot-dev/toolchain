import fs from 'fs';
import path from 'path';

import { TMP_DIR } from '../../../test/config';
import { COPIED_CONFIGS } from '../constants';
import { copyToProject } from '../initializeProject';
import { wipeAndCreateDir } from '../wipeAndCreateDir';


const libDir = path.resolve(__dirname, '../../../lib');
const libDirExists = fs.existsSync(libDir);

describe('copyToProject()', () => {
  if (!libDirExists) {
    test.only("Check for whether the 'lib' dir exists'", () => {
      console.warn('The lib file was not found. Some tests will be skipped.');
    });
  }

  it('should copy files from sourceDir to targetDir', () => {
    const targetDir = path.join(TMP_DIR, 'copyToProject-test');
    wipeAndCreateDir(targetDir);

    /* TODO: This test depends on having the built project at `lib/`. Either break this dependency
       or make it explicit by renaming the test suffix to `app.test.ts` */
    const files = COPIED_CONFIGS;
    copyToProject({
      sourceDir: libDir,
      targetDir,
      files,
    });

    files.forEach((file) => {
      const filePath = path.resolve(targetDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
