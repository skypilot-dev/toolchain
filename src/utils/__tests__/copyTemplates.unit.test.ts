import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { TMP_DIR } from '../../../test/config';
import { copyTemplates, CopyTemplatesOptions, readTransformWriteTemplate } from '../copyTemplates';

function transform(rawTemplate: string): string {
  return rawTemplate.replace('<PACKAGE-NAME>', '@org/package');
}

const sourceDir = path.join(TMP_DIR, 'source');
const targetDir = path.join(TMP_DIR, 'target');
mkdirSync(sourceDir, { recursive: true }); // `recursive` is not supported in Node v8
mkdirSync(targetDir, { recursive: true });


describe('readTransformWriteTemplate()', () => {
  describe("readTransformWriteTemplate('TMP_DIR/source.js', 'TMP_DIR/target.js'", () => {
    const inFile = 'readTransformWriteTemplate-source.js';
    const outFile = 'readTransformWriteTemplate-target.js';
    const content = 'Package: <PACKAGE-NAME>';

    const sourcePath = path.join(TMP_DIR, inFile);
    const targetPath = path.join(TMP_DIR, outFile);

    /* Create the source file so that it can be copied. */
    writeFileSync(sourcePath, content, 'utf-8');

    it('should copy the source to the target', () => {
      readTransformWriteTemplate({ sourcePath, targetPath, transform });
      expect(existsSync(targetPath));
    });

    it('template vars in the source should be replaced with values in the target', () => {
      const content = readFileSync(targetPath, 'utf-8');
      expect(content).toBe('Package: @org/package');
    });
  });

  describe('copyTemplates(), given an array of sources & targets and a transform', () => {
    const copyTemplateOptions: CopyTemplatesOptions = {
      sourceDir,
      targetDir,
      templates: [
        { inFile: 'copyTemplates-source1.js', outFile: 'copyTemplates-target1.js' },
        { inFile: 'copyTemplates-source-and-target.js' },
      ],
      transform,
    };

    /* Create the source files so that they can be copied. */
    copyTemplateOptions.templates.forEach(({ inFile }) => {
      const content = 'Package: <PACKAGE-NAME>';
      const sourcePath = path.join(sourceDir, inFile);
      writeFileSync(sourcePath, content);
    });

    copyTemplates(copyTemplateOptions);
    it('should write transformed content to the target files', () => {
      copyTemplateOptions.templates.forEach(({ inFile, outFile = inFile }) => {
        const targetPath = path.join(targetDir, outFile);
        const content = readFileSync(targetPath, 'utf-8');
        expect(content).toBe('Package: @org/package');
      });
    });

    it('when an outFile is specified, should use it as the target name', () => {
      const renamedTemplateDef = copyTemplateOptions.templates[0];
      const targetPath = path.join(targetDir, renamedTemplateDef.outFile as string);
      const targetExists = existsSync(targetPath);
      expect(targetExists).toBe(true);
    });

    it('when no outFile is specified, should use the inFile as the target name', () => {
      const sameNameTemplateDef = copyTemplateOptions.templates[1];
      const targetPath = path.join(targetDir, sameNameTemplateDef.inFile);
      const targetExists = existsSync(targetPath);
      expect(targetExists).toBe(true);
    });

    it('when no outFile is specified, should use the inFile as the target name', () => {
      const sameNameTemplateDef = copyTemplateOptions.templates[1];
      const targetPath = path.join(targetDir, sameNameTemplateDef.inFile);
      const targetExists = existsSync(targetPath);
      expect(targetExists).toBe(true);
    });
  });

  describe('copyTemplates(), given an array of sources & targets and no transform', () => {
    const copyTemplateOptions: CopyTemplatesOptions = {
      sourceDir,
      targetDir,
      templates: [
        { inFile: 'copyTemplates-source2.js', outFile: 'copyTemplates-target2.js' },
        { inFile: 'copyTemplates-source-and-target2.js' },
      ],
    };

    const staticContent = 'Static content';
    /* Create the source files so that they can be copied. */
    copyTemplateOptions.templates.forEach(({ inFile }) => {
      const sourcePath = path.join(sourceDir, inFile);
      writeFileSync(sourcePath, staticContent);
    });

    copyTemplates(copyTemplateOptions);
    it('should copy each file without changing it', () => {
      copyTemplateOptions.templates.forEach(({ inFile, outFile = inFile }) => {
        const targetPath = path.join(targetDir, outFile);
        const content = readFileSync(targetPath, 'utf-8');
        expect(content).toBe(staticContent);
      });
    });
  });
});
