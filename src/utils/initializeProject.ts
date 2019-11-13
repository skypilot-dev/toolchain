/* eslint-disable no-console */

import fs from 'fs';
/* -- Imports -- */
import path from 'path';

import { bulkReadTransformWrite, makeSourcesAndTargetsArray } from './bulkReadTransformWrite';
import { COPIED_CONFIGS, CONFIG_TEMPLATES, CONFIGURATOR_CONFIGS } from './constants';
import { makeReplaceFn } from './makeReplaceFn';
import { parsePathToPackage } from './parsePathToPackage';
import { updatePackageFile } from './updatePackageFile';


/* -- Typings -- */

/* These options are used in testing. */
interface InitializeProjectOptions {
  sourceDir?: string;
  targetDir?: string;
  projectDir?: string;
  verbose?: boolean;
}


/* -- Helper functions -- */
export function getProjectRootDir(): string {
  return path.resolve(__dirname).split('/node_modules')[0];
}

function isTsFileName(name: string): boolean {
  return name.slice(-3) === '.ts';
}

export function dirHasTsFile(dir: string): boolean {
  /* Get all entries in the directory. */
  const directoryEntries = fs.readdirSync(dir, { withFileTypes: true }); // requires Node v10+
  if (directoryEntries.some((dirent) => dirent.isFile() && isTsFileName(dirent.name))) {
    return true
  }

  const subdirs = directoryEntries.filter((dirent) => dirent.isDirectory());
  for (let i = 0; i < subdirs.length; i += 1) {
    const dirent = subdirs[i];
    const subDir = path.resolve(dir, dirent.name);
    if (dirHasTsFile(subDir)) {
      return true;
    }
  }
  return false;
}

/* -- Constants -- */
const scripts: { key: string; value: string }[] = [
  { key: 'build', value: 'rm -rf lib && yarn run copy-templates && yarn run compile-ts && yarn run generate-typings' },
  { key: 'check-types', value: 'tsc' },
  { key: 'compile-ts', value: 'babel ./src --out-dir ./lib --extensions .ts --ignore \'**/*.test.ts\''},
  { key: 'generate-typings', value: 'tsc --project tsconfig.generate-typings.json' },
  { key: 'prepublishOnly', value: 'yarn run check-types && yarn test && yarn run build' },
  { key: 'test', value: 'jest' },
];

const packageDir = path.resolve(__dirname, '..');
const projectDir = getProjectRootDir();
const relativePathToPackage = parsePathToPackage(packageDir);


/* -- Main subfunctions -- */

/* Add scripts to the package file. */
function addScripts(verbose = false): void {
  /* TODO: Rewrite this code for clarity, or at least document what it's doing. */
  const newScripts = scripts.reduce((newScripts: { [key: string]: string }, { key, value }) => {
    newScripts[key] = value;
    if (verbose) {
      console.log(`  Added "scripts": { "${key}": "${value}" }`);
    }
    return newScripts;
  }, {});
  updatePackageFile({ scripts: newScripts });
}

/* Copy these files from `.lib/` to the project. */
export function copyToProject({
  sourceDir = packageDir,
  targetDir = projectDir,
  files = [...COPIED_CONFIGS, ...CONFIGURATOR_CONFIGS],
  verbose = false,
}): void {
  const sourcesAndTargets = makeSourcesAndTargetsArray(files);
  bulkReadTransformWrite({ sourceDir, targetDir, sourcesAndTargets, verbose });
}

/* Remove the `-template` suffix from these files, replace `<PATH-TO-PACKAGE>` with the path to
   this package (under `node_modules/`), then copy them to the project. */
export function injectPathAndCopyToProject({
  sourceDir = packageDir,
  targetDir = projectDir,
  files = CONFIG_TEMPLATES,
  verbose = false,
}): void {
  const sourcesAndTargets = files.map((targetFile) => ({
    sourceFile: `${targetFile}-template`,
    targetFile,
  }));
  const transformFn = makeReplaceFn([
    { searchFor: '<PATH-TO-PACKAGE>', replaceWith: relativePathToPackage },
  ]);
  bulkReadTransformWrite({ sourceDir, targetDir, sourcesAndTargets, transformFn, verbose })
}

/* -- Main function -- */
export function initializeProject(options: InitializeProjectOptions = {}): void {
  /* Overrides are enabled here to allow testing. */
  const {
    sourceDir = packageDir,
    targetDir = projectDir,
    verbose = false,
  } = options;

  console.log('Toolchain > Creating configuration files...');
  copyToProject({ sourceDir, targetDir, verbose });
  injectPathAndCopyToProject({ sourceDir, targetDir, verbose });

  console.log('Toolchain > Adding values to package.json...');
  addScripts(verbose);

  console.log('Toolchain > Done.');
}
