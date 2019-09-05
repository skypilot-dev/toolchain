import { writeFileSync } from 'fs';

import tmp from 'tmp';

import { readPackageFile, updatePackageFile } from '../updatePackageFile';

const packageFileContent = `
{
  "scripts": {
    "existingScript": "do something"
  }
}
`;

const pathToPackageFile = tmp.fileSync().name;
writeFileSync(pathToPackageFile, packageFileContent);


describe('updatePackageFile()', () => {
  describe("given a new key and value under the 'scripts' key in package.json", () => {

    it('should merge the key and value into package.json without overriding existing keys', () => {
      const newScript = { scripts: { newScript: 'do something new' } };
      updatePackageFile(newScript, pathToPackageFile);

      const packageContent = readPackageFile(pathToPackageFile);
      expect(packageContent).toMatchObject({
        scripts: {
          existingScript: 'do something',
          newScript: 'do something new',
        },
      });
    });
  });
});
