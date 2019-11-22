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
  replace,
}

export interface UpdatePackageFileOptions {
  pathToFile?: string;
  updateStrategy?: UpdateStrategy;
}


const mergeFns = {
  /* Create only those entries whose keys don't exist in the existing object. */
  [UpdateStrategy.create]: (initialPkg: JsonObject, update: JsonObject): JsonObject => {
    const filteredPkgContent = pickDifference(update, initialPkg);
    if (Object.keys(filteredPkgContent).length === 0) {
      /* None of the entries have new keys, so simply return the initial pkg without alteration. */
      return initialPkg;
    }
    /* Merge the filtered keys into the existing content */
    return deepmerge(initialPkg, filteredPkgContent);
  },
  [UpdateStrategy.merge]: (initialPkg: JsonObject, update: JsonObject): JsonObject =>
    deepmerge(initialPkg, update),

  /* Add all new entries into the existing content, replacing any existing keys. */
  [UpdateStrategy.replace]: (pkgContent: JsonObject, update: JsonObject): JsonObject => ({
    ...pkgContent,
    ...update,
  }),
};


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

  const mergeFn = mergeFns[updateStrategy];
  const updatedPkgContent = mergeFn(pkgContent, data);

  /* Save the merged data to the file */
  if (updatedPkgContent) {
    writeFileSync(pathToFile, JSON.stringify(updatedPkgContent, undefined, 2));
  }
}
