import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { TMP_DIR } from '../../../test/config';
import { BulkRtwOptions, bulkReadTransformWrite } from '../bulkReadTransformWrite';

function transformFn(rawTemplate: string): string {
  return rawTemplate.replace('<PACKAGE-NAME>', '@org/package');
}

const sourceDir = path.join(TMP_DIR, 'source');
const targetDir = path.join(TMP_DIR, 'target');

mkdirSync(sourceDir, { recursive: true }); // `recursive` requires Node v10+
mkdirSync(targetDir, { recursive: true });

describe('readTransformWriteTemplate()', () => {
  describe('given an array of sources & targets and a transform', () => {
    const bulkRtwOptions: BulkRtwOptions = {
      sourceDir,
      targetDir,
      sourcesAndTargets: [
        { sourceFile: 'bulkRtw-source1.js', targetFile: 'bulkRtw-target1.js' },
        { sourceFile: 'bulkRtw-source-and-target.js' },
      ],
      transformFn,
    };

    /* Create the source files. */
    bulkRtwOptions.sourcesAndTargets.forEach(({ sourceFile }) => {
      const content = 'Package: <PACKAGE-NAME>';
      const sourcePath = path.join(sourceDir, sourceFile);
      writeFileSync(sourcePath, content);
    });

    bulkReadTransformWrite(bulkRtwOptions);
    it('should write transformed content to the target files', () => {
      bulkRtwOptions.sourcesAndTargets.forEach(({ sourceFile, targetFile = sourceFile }) => {
        const targetPath = path.join(targetDir, targetFile);
        const content = readFileSync(targetPath, 'utf-8');
        expect(content).toBe('Package: @org/package');
      });
    });

    it('when a targetFile is specified, should use it as the target name', () => {
      const renamedTemplateDef = bulkRtwOptions.sourcesAndTargets[0];
      const targetPath = path.join(targetDir, renamedTemplateDef.targetFile as string);
      const targetExists = existsSync(targetPath);
      expect(targetExists).toBe(true);
    });

    it('when no targetFile is specified, should use the sourceFile as the target name', () => {
      const sameNameTemplateDef = bulkRtwOptions.sourcesAndTargets[1];
      const targetPath = path.join(targetDir, sameNameTemplateDef.sourceFile);
      const targetExists = existsSync(targetPath);
      expect(targetExists).toBe(true);
    });

    it('when no targetFile is specified, should use the sourceFile as the target name', () => {
      const sameNameTemplateDef = bulkRtwOptions.sourcesAndTargets[1];
      const targetPath = path.join(targetDir, sameNameTemplateDef.sourceFile);
      const targetExists = existsSync(targetPath);
      expect(targetExists).toBe(true);
    });
  });

  describe('given an array of sources & targets and no transform', () => {
    const bulkRtwOptions: BulkRtwOptions = {
      sourceDir,
      targetDir,
      sourcesAndTargets: [
        { sourceFile: 'bulkRtw-source2.js', targetFile: 'bulkRtw-target2.js' },
        { sourceFile: 'bulkRtw-source-and-target2.js' },
      ],
    };
    const staticContent = 'Static content';

    /* Create the source files. */
    bulkRtwOptions.sourcesAndTargets.forEach(({ sourceFile }) => {
      const sourcePath = path.join(sourceDir, sourceFile);
      writeFileSync(sourcePath, staticContent);
    });

    bulkReadTransformWrite(bulkRtwOptions);
    it('should copy each file without changing it', () => {
      bulkRtwOptions.sourcesAndTargets.forEach(({ sourceFile, targetFile = sourceFile }) => {
        const targetPath = path.join(targetDir, targetFile);
        const content = readFileSync(targetPath, 'utf-8');
        expect(content).toBe(staticContent);
      });
    });
  });
});
