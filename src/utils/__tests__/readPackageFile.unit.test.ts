import { readPackageFile } from '../readPackageFile';

describe('readPackageFile', () => {
  it('should get the contents of the package file as an object literal', () => {
    const pkgContent = readPackageFile();
    expect(pkgContent).toHaveProperty('name');
    expect(pkgContent).toHaveProperty('version');
  });
});
