/* -- Imports -- */
/* Built-in imports */
import { readFileSync, writeFileSync } from 'fs';

/* Third-party imports */
import deepmerge from 'deepmerge';

/* Project imports */
import { pickDifference } from '../common/object/pickDifference';
import { JsonObject } from '../common/types';


/* -- Typings -- */
export enum UpdateStrategy {
  create,
  merge,
  /* TODO: Allow replacements as an update strategy. */
  // replace,
}

export interface UpdatePackageFileOptions {
  pathToFile?: string;
  updateStrategy?: UpdateStrategy;
}


/* -- Helper functions -- */
export function readPackageFile(pathToFile: string): JsonObject {
  const pkgJson = readFileSync(pathToFile, 'utf-8');
  return JSON.parse(pkgJson);
}


/* -- Main function -- */
/* Given a JSON object, merge the object into `package.json`. */
export function updatePackageFile(data: JsonObject, options: UpdatePackageFileOptions = {}): void {
  /* Define defaults */
  const {
    pathToFile = './package.json',
    updateStrategy = UpdateStrategy.merge,
  } = options;

  const pkgContent = readPackageFile(pathToFile);

  let updatedPkgContent;
  if (updateStrategy === UpdateStrategy.merge) {
    updatedPkgContent = deepmerge(pkgContent, data);
  } else {
    /* Get only the keys that don't exist in the existing package content */
    const filteredPkgContent = pickDifference(data, pkgContent);
    if (Object.keys(filteredPkgContent).length === 0) {
      return;
    }
    updatedPkgContent = deepmerge(pkgContent, filteredPkgContent);
  }

  /* Save the merged data to the file */
  writeFileSync(pathToFile, JSON.stringify(updatedPkgContent, undefined, 2));
}
