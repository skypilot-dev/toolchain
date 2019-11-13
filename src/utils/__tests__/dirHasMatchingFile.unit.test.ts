import fs from 'fs';
import path from 'path';

import { TMP_DIR } from '../../../test/config';
import { dirHasMatchingFile } from '../dirHasMatchingFile';
import { wipeAndCreateDir } from '../wipeAndCreateDir';


describe('dirHasMatchingFile(:dir, :extension)', () => {
  it('should return false if the dir contains no files matching the pattern', () => {
    const targetDir = path.join(TMP_DIR, 'dirHasMatchingFile-test');
    wipeAndCreateDir(targetDir);

    const hasTsFile = dirHasMatchingFile(targetDir, /\.ts$/);
    expect(hasTsFile).toBe(false);
  });

  it('should return true if the dir contains a file matching the pattern', () => {
    const targetDir = path.join(TMP_DIR, 'dirHasMatchingFile-test');
    wipeAndCreateDir(targetDir);

    /* Create a `.ts` file in the directory. */
    const tsFile = path.join(targetDir, 'file.ts');
    fs.writeFileSync(tsFile, 'export {}', { encoding: 'utf8'});

    const hasTsFile = dirHasMatchingFile(targetDir, /\.ts$/);
    expect(hasTsFile).toBe(true);
  });

  it('should return true if a subdir contains a file matching the pattern', () => {
    /* Create a directory for the test. */
    const targetDir = path.join(TMP_DIR, 'dirHasMatchingFile-test');
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

    const hasTsFile = dirHasMatchingFile(targetDir, /\.ts$/);
    expect(hasTsFile).toBe(true);
  });
});
