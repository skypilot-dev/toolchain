/* This script copies templates to the `lib/` directory for distribution. */

/* -- Imports -- */
import path from 'path';

import { name as packageName } from '../package.json';
import { bulkReadTransformWrite, makeSourcesAndTargetsArray } from '../src/utils/bulkReadTransformWrite';
import { makeReplaceFn } from '../src/utils/makeReplaceFn';
import { CONFIGS, CONFIG_TEMPLATES, CONFIGURATOR_CONFIGS } from '../src/utils/constants';


/* -- Helper functions -- */

/* Resolve a path relative to the project root */
function resolvePath(relativePath = ''): string {
  const projectRoot = path.resolve(__dirname, '..');
  return path.resolve(projectRoot, relativePath);
}

/* -- Main functions -- */
/* Copy these files from this project to `lib/` (the distribution bundle). */
function copyToLib(): void {
  const sourceDir = resolvePath('.');
  const targetDir = resolvePath('lib');
  const sourcesAndTargets = makeSourcesAndTargetsArray(CONFIGS);
  bulkReadTransformWrite({ sourceDir, targetDir, sourcesAndTargets })
}

/* Copy these files to `lib/` after replacing `<PACKAGE-NAME>` with the name of this package. */
function insertPackageNameAndCopyToLib(): void {
  const sourceDir = resolvePath('templates');
  const targetDir = resolvePath('lib');
  const sourcesAndTargets = CONFIGURATOR_CONFIGS.map((file) => ({ sourceFile: file }));
  const replacements = [
    { searchFor: '<PACKAGE-NAME>', replaceWith: packageName },
  ];
  const transformFn = makeReplaceFn(replacements);
  bulkReadTransformWrite({ sourceDir, targetDir, sourcesAndTargets, transformFn })
}

/* Copy these files to `lib/` after replacing `./configs/` (the path in this package) with
   `<PATH-TO-PACKAGE>/configs/`. When `toolchain init` is run, that string will be replaced with
   the appropriate path to this package (under `node_modules/`) in the consuming project.
   The files are marked with a `-template` suffix to indicate that they are not ready to use. */
function insertPathVarAndCopyToLib(): void {
  const sourceDir = resolvePath('.');
  const targetDir = resolvePath('lib');
  const sourcesAndTargets = CONFIG_TEMPLATES.map((sourceFile) => ({ sourceFile, targetFile: `${sourceFile}-template`}));
  const transformFn = makeReplaceFn([
    { searchFor: './configs/', replaceWith: '<PATH-TO-PACKAGE>/configs/' },
  ]);
  bulkReadTransformWrite({ sourceDir, targetDir, sourcesAndTargets, transformFn })
}

copyToLib();
insertPackageNameAndCopyToLib();
insertPathVarAndCopyToLib();
