import fs  from 'fs';
import path from 'path';

import { TMP_DIR } from '../../../test/config';
import { readTransformWrite } from '../readTransformWrite';


/* -- Helper functions -- */
function transformFn(rawTemplate: string): string {
  return rawTemplate.replace('<PACKAGE-NAME>', '@org/package');
}

function createSource(sourcePath: string, content: string): void {
  fs.writeFileSync(sourcePath, content, 'utf-8');
}

function deleteTargetIfExists(targetPath: string): void {
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }
}

describe('readTransformWrite()', () => {
  describe('given source & target files and a transform function', () => {
    const source = 'readTransformWrite-source.js';
    const target = 'readTransformWrite-target.js';
    const content = 'Package: <PACKAGE-NAME>';

    const sourcePath = path.join(TMP_DIR, source);
    const targetPath = path.join(TMP_DIR, target);

    createSource(sourcePath, content);
    deleteTargetIfExists(targetPath);

    /* Perform the "read, transform, write" operation. */
    readTransformWrite(sourcePath, targetPath, transformFn);

    it('should create the target', () => {
      expect(fs.existsSync(targetPath));
    });

    it('should apply the transformation', () => {
      const content = fs.readFileSync(targetPath, 'utf-8');
      expect(content).toBe('Package: @org/package');
    });
  });

  describe('given source & target files and no transform function', () => {
    const source = 'readTransformWrite-copy-source.js';
    const target = 'readTransformWrite-copy-target.js';
    const content = 'Package: <PACKAGE-NAME>';

    const sourcePath = path.join(TMP_DIR, source);
    const targetPath = path.join(TMP_DIR, target);

    createSource(sourcePath, content);
    deleteTargetIfExists(targetPath);

    /* Perform the "read, transform, write" operation. */
    readTransformWrite(sourcePath, targetPath);

    it('should create the target', () => {
      expect(fs.existsSync(targetPath));
    });

    it('target should be identical to source', () => {
      const content = fs.readFileSync(targetPath, 'utf-8');
      expect(content).toBe('Package: <PACKAGE-NAME>');
    });
  });
});
