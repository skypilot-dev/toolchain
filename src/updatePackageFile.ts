import { readFileSync, writeFileSync } from 'fs';

import deepmerge from 'deepmerge';

const pathToProjectPackageFile = './package.json';

export function readPackageFile(pathToPackageFile: string = pathToProjectPackageFile): object {
  const pkgJson = readFileSync(pathToPackageFile, 'utf-8');
  return JSON.parse(pkgJson);
}

export function updatePackageFile(data: object, pathToPackageFile: string = pathToProjectPackageFile): void {
  const pkg = readPackageFile(pathToPackageFile);
  const mergedPkg = deepmerge(pkg, data);
  writeFileSync(pathToPackageFile, JSON.stringify(mergedPkg, undefined, 2));
}
