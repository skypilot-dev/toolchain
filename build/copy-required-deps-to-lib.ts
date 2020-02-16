import fs from 'fs';
import path from 'path';
import { REQUIRED_DEPENDENCIES } from '../src/utils/constants';
import { getDependenciesByNames } from '../src/utils/getDependenciesByNames';

const requiredDependencies = {
  dependencies: {
    ...getDependenciesByNames(REQUIRED_DEPENDENCIES),
  },
};

fs.writeFileSync(
  path.resolve('lib', 'required-dependencies.json'),
  JSON.stringify(requiredDependencies, undefined, 2),
);
