import fs from 'fs';
import path from 'path';

import { TMP_DIR } from '../../../test/config';
import { COPIED_CONFIGS, CONFIG_TEMPLATES, CONFIGURATOR_CONFIGS } from '../constants';
import { copyToProject, dirHasTsFile, injectPathAndCopyToProject } from '../initializeProject';
import { wipeAndCreateDir } from '../wipeAndCreateDir';


const libDir = path.resolve(__dirname, '../../../lib');

describe('copyToProject()', () => {
  it('should copy files from sourceDir to targetDir', () => {
    const targetDir = path.join(TMP_DIR, 'copyToProject-test');
    (targetDir);

    /* TODO: This test depends on having the built project at `lib/`. Either break this dependency
       or make it explicit by renaming the test suffix to `app.test.ts` */
    const files = [...COPIED_CONFIGS, ...CONFIGURATOR_CONFIGS];
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

describe('dirHasTsFile(:dir)', () => {
  it('should return false if the dir contains no files with the `.ts` extension', () => {
    const targetDir = path.join(TMP_DIR, 'dirHasTsFile-test');
    wipeAndCreateDir(targetDir);

    const hasTsFile = dirHasTsFile(targetDir);
    expect(hasTsFile).toBe(false);
  });

  it('should return true if the dir contains a file with the `.ts` extension', () => {
    const targetDir = path.join(TMP_DIR, 'dirHasTsFile-test');
    wipeAndCreateDir(targetDir);

    /* Create a `.ts` file in the directory. */
    const tsFile = path.join(targetDir, 'file.ts');
    fs.writeFileSync(tsFile, 'export {}', { encoding: 'utf8'});

    const hasTsFile = dirHasTsFile(targetDir);
    expect(hasTsFile).toBe(true);
  });

  it('should return true if a subdir contains a file with the `.ts` extension', () => {
    /* Create a directory for the test. */
    const targetDir = path.join(TMP_DIR, 'dirHasTsFile-test');
    wipeAndCreateDir(targetDir);

    /* Create a sub-sub-directory. */
    const subDir = path.join(targetDir, 'subdir', 'subsubdir');
    fs.mkdirSync(subDir, { recursive: true });

    /* Create a non `.ts` file in the sub-sub-directory. */
    const nonTsFile = path.join(subDir, 'file.js');
    fs.writeFileSync(nonTsFile, 'export {}', { encoding: 'utf8'});

    /* Create a `.ts` file in the sub-sub-directory. */
    const tsFile = path.join(subDir, 'file.ts');
    fs.writeFileSync(tsFile, 'export {}', { encoding: 'utf8'});

    const hasTsFile = dirHasTsFile(targetDir);
    expect(hasTsFile).toBe(true);
  });
});

describe('injectPathAndCopyToProject()', () => {
  it('should remove the `-template` suffix and copy files from sourceDir to targetDir', () => {
    const targetDir = path.join(TMP_DIR, 'removeSuffixAndCopyToProject-test');
    wipeAndCreateDir(targetDir);

    /* TODO: This test depends on having the built project at `lib/`. Either break this dependency
       or make it explicit by renaming the test suffix to `app.test.ts` */
    const files = CONFIG_TEMPLATES;
    injectPathAndCopyToProject({
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
