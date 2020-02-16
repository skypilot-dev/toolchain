import fs from 'fs';
import path from 'path';
import { readPackageFile } from '../src/utils/readPackageFile';

/* This script copies all entries from `dependencies` in Toolchain's package file to a JSON
 * file that will be read by Toolchain init. The dependencies will become dev dependencies in
 * the consuming project. */
const dependencies = readPackageFile().dependencies;

fs.writeFileSync(
  path.resolve('lib', 'required-dependencies.json'),
  JSON.stringify({ devDependencies: dependencies }, undefined, 2),
);
