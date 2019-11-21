import { writeFileSync } from 'fs';

import tmp from 'tmp';

import { readPackageFile, updatePackageFile, UpdateStrategy } from '../updatePackageFile';

const packageFileContent = `
{
  "version": "1.0.0",
  "files": [
    "/lib"
  ], 
  "scripts": {
    "existingScript": "do something"
  }
}
`;

function createTmpPkgFile(suffix: string): string {
  const pathToFile = `${tmp.fileSync().name}-${suffix}`;
  writeFileSync(pathToFile, packageFileContent);
  return pathToFile;
}


describe('updatePackageFile()', () => {
  describe("given a new entry under the 'scripts' key", () => {
    const pathToFile = createTmpPkgFile('merge-test');
    it('should merge the key and value into package.json', () => {
      const newScript = { scripts: { newScript: 'do something new' } };
      updatePackageFile(newScript, { pathToFile });

      const packageContent = readPackageFile(pathToFile);
      expect(packageContent).toMatchObject({
        version: '1.0.0',
        scripts: {
          existingScript: 'do something',
          newScript: 'do something new',
        },
      });
    });
  });

  describe('given a key with an array value', () => {
    const pathToFile = createTmpPkgFile('array-test');
    it("should create the array if it doesn't exist", () => {
      const packageFileEntry = { keywords: ['test', 'array', ['nested item']] };
      updatePackageFile(packageFileEntry, { pathToFile });

      const packageContent = readPackageFile(pathToFile);
      expect(packageContent).toMatchObject({
        version: '1.0.0',
        keywords: [
          'test',
          'array',
          ['nested item'],
        ],
      });
    });

    it('should add the value to an existing array', () => {
      const update = { files: ['anotherDir'] };
      updatePackageFile(update, { pathToFile });

      const packageContent = readPackageFile(pathToFile);
      expect(packageContent).toMatchObject({
        version: '1.0.0',
        files: [
          '/lib',
          'anotherDir',
        ],
      });
    });
  });

  describe('when updateStrategy = create', () => {
    const originalPkgFileContent = { version: '1.0.0', files: ['/lib'] };
    const updateStrategy = UpdateStrategy.create;

    describe('given two keys, none of which exists', () => {
      const pathToFile = createTmpPkgFile('create-0');

      it('should merge in both keys', () => {
        const update = {
          dirs: ['/dir'],
          keywords: ['test'],
        };
        const updateStrategy = UpdateStrategy.create;

        updatePackageFile(update, { pathToFile, updateStrategy });

        const packageContent = readPackageFile(pathToFile);
        expect(packageContent).toMatchObject({
          version: '1.0.0',
          dirs: ['/dir'],
          files: ['/lib'],
          keywords: ['test'],
        });
      });
    });

    describe('given two keys, one of which already exists', () => {
      const pathToFile = createTmpPkgFile('create-1');
      const update = { files: ['anotherDir'], dirs: ['/dir'] };

      updatePackageFile(update, { pathToFile, updateStrategy });

      it('should merge in only the new key', () => {
        const packageContent = readPackageFile(pathToFile);
        expect(packageContent).toMatchObject({
          version: '1.0.0',
          dirs: ['/dir'],
          files: ['/lib'],
        });
      });
    });

    describe('given two keys, both of which exist', () => {
      const pathToFile = createTmpPkgFile('create-1');
      const update = { version: '2.0.0', files: ['anotherDir'] };

      updatePackageFile(update, { pathToFile, updateStrategy });

      it('should do nothing', () => {
        const packageContent = readPackageFile(pathToFile);
        expect(packageContent).toMatchObject(originalPkgFileContent);
      });
    });

    describe('given an empty object', () => {
      const pathToFile = createTmpPkgFile('empty');
      const update = {};

      updatePackageFile(update, { pathToFile, updateStrategy });

      it('should do nothing', () => {
        const packageContent = readPackageFile(pathToFile);
        expect(packageContent).toMatchObject(originalPkgFileContent);
      });
    });
  });
});
