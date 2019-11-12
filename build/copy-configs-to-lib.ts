/* This script copies templates to the `lib/` directory for distribution. */

/* -- Imports -- */
import path from 'path';

import { name as packageName } from '../package.json';
import { bulkReadTransformWrite, makeSourcesAndTargetsArray } from '../src/utils/bulkReadTransformWrite';
import { makeReplaceFn } from '../src/utils/makeReplaceFn';


/* -- Helper functions -- */

/* Resolve a path relative to the project root */
function resolvePath(relativePath = ''): string {
  const projectRoot = path.resolve(__dirname, '..');
  return path.resolve(projectRoot, relativePath);
}

/* -- Main functions -- */
/* Copy these files to the distribution bundle. */
function copyFiles(): void {
  const sourceDir = resolvePath('.');
  const targetDir = resolvePath('lib');
  const files = makeSourcesAndTargetsArray([
    '.editorconfig',
    '.eslintignore',
    '.gitignore',
    'jest.config.js',
    'jest.integration.config.js',
    'jest.standalone.config.js',
    'configs/tsconfig.generate-typings.json',
    'configs/tsconfig.main.json',
  ]);
  bulkReadTransformWrite({ sourceDir, targetDir, files })
}

/* Copy these files after replacing `<PACKAGE-NAME>` with the name of this package. */
function insertPackageNameAndCopy(): void {
  const sourceDir = resolvePath('templates');
  const targetDir = resolvePath('lib');
  const files = [
    '.huskyrc.js',
    '.lintstagedrc.js',
  ].map((file) => ({ sourceFile: file }));
  const replacements = [
    { searchFor: '<PACKAGE-NAME>', replaceWith: packageName },
  ];
  const transformFn = makeReplaceFn(replacements);
  bulkReadTransformWrite({ sourceDir, targetDir, files, transformFn })
}

/* Copy these files after replacing `./config` (the path in this package) with `<PATH-TO-PACKAGE>`,
 * which will be replaced, when `toolchain init` is run, with the path to the same file in the
 * consuming project. */
function insertPathVarAndCopy(): void {
  const sourceDir = resolvePath('.');
  const targetDir = resolvePath('lib');
  const files = makeSourcesAndTargetsArray([
    'babel.config.js',
    '.eslintrc.js',
    'tsconfig.generate-typings.json',
    'tsconfig.json',
  ]);
  const transformFn = makeReplaceFn([
    { searchFor: './configs/', replaceWith: '<PATH-TO-PACKAGE>/configs/' },
  ]);
  bulkReadTransformWrite({ sourceDir, targetDir, files, transformFn })
}

copyFiles();
insertPackageNameAndCopy();
insertPathVarAndCopy();
