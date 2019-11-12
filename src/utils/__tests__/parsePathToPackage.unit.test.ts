import { parsePathToPackage } from '../parsePathToPackage';

describe('parsePathToPackage()', () => {
  it('should return the portion of the path from `/node_modules/` onward', () => {
    const path = '/Users/user/repos/project/node_modules/@org/package';
    const relativePath = parsePathToPackage(path);
    const expectedRelativePath = './node_modules/@org/package';
    expect(relativePath).toBe(expectedRelativePath);
  });
});
