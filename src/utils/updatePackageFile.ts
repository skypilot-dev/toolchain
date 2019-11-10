import { readFileSync, writeFileSync } from 'fs';

import deepmerge from 'deepmerge';


interface UpdatePackageFileOptions {
  pathToFile?: string;
}


export function readPackageFile(pathToFile: string): object {
  const pkgJson = readFileSync(pathToFile, 'utf-8');
  return JSON.parse(pkgJson);
}

export function updatePackageFile(data: object, options: UpdatePackageFileOptions = {}): void {
  /* Define defaults */
  const {
    pathToFile = './package.json',
  } = options;

  /* Merge the new data into the existing data */
  const pkgContent = readPackageFile(pathToFile);
  const mergedPkgContent = deepmerge(pkgContent, data);

  /* Save the merged data to the file */
  writeFileSync(pathToFile, JSON.stringify(mergedPkgContent, undefined, 2));
}
