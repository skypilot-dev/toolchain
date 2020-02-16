import path from 'path';
import { getDependenciesByNames } from '../getDependenciesByNames';

describe('', () => {
  it('should', () => {
    const dependencies = getDependenciesByNames(
      ['dep1', 'dep3', 'dep2'],
      {pathToPackageFile: path.resolve(__dirname, 'getDependenciesByName-package.json') },
    );
    expect(dependencies).toEqual({
      'dep1': '^0.0.0',
      'dep2': '~0.0.0',
      'dep3': '1.0.0',
    });
  });
});
