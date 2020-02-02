/* -- Imports -- */
/* Built-in imports */
import { writeFileSync } from 'fs';

/* Third-party imports */
import deepmerge from 'deepmerge';

/* Project imports */
import { pickDifference } from '../common/object/pickDifference';
import { sortObjectEntries } from '../common/object/sortObjectEntries';
import { JsonObject } from '../common/types';
import { readPackageFile } from './readPackageFile';

/* -- Typings -- */
export enum UpdateStrategy {
  create,
  merge,
  replace,
}

export interface UpdatePackageFileOptions {
  keysToSort?: string[];
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
  [UpdateStrategy.replace]: (initialPkg: JsonObject, update: JsonObject): JsonObject => ({
    ...initialPkg,
    ...update,
  }),
};


/* -- Main function -- */
/* Given a JSON object, merge the object into `package.json`. */
export function updatePackageFile(data: JsonObject, options: UpdatePackageFileOptions = {}): void {
  /* Define defaults */
  const {
    keysToSort = [],
    pathToFile = './package.json',
    updateStrategy = UpdateStrategy.merge,
  } = options;

  const initialPkg = readPackageFile(pathToFile);

  const mergeFn = mergeFns[updateStrategy];
  const updatedPkg = mergeFn(initialPkg, data);
  const sortedPkg = sortObjectEntries(updatedPkg, keysToSort);

  /* Save the merged data to the file */
  if (updatedPkg) {
    writeFileSync(pathToFile, JSON.stringify(sortedPkg, undefined, 2));
  }
}
