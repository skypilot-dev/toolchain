/* eslint-disable no-console */

import fs from 'fs';
/* -- Imports -- */
import path from 'path';

import { bulkReadTransformWrite, makeSourcesAndTargetsArray } from './bulkReadTransformWrite';
import { COPIED_CONFIGS, CONFIG_TEMPLATES, CONFIGURATOR_CONFIGS } from './constants';
import { dirHasMatchingFile } from './dirHasMatchingFile';
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

/* If the project doesn't create a TypeScript file, create one at `src/index.ts` to allow
   type-checking to pass. */
export function ensureTsFileExists({
  targetDir = path.join(projectDir, 'src'),
  targetFile = 'index.ts',
  verbose = false,
}): void {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync((targetDir));
  } else {
    if (dirHasMatchingFile(targetDir, /\.ts$/)) {
      return;
    }
  }
  const target = path.join(targetDir, targetFile);
  /* This is the minimal content needed to create a valid module in TypeScript. */
  const minimalTsModule = 'export {}\n';
  fs.writeFileSync(target, minimalTsModule, { encoding: 'utf8' });
  if (verbose) {
    console.log(`  Created a TypeScript file at 'src/${targetFile}' to prevent type-checking from failing`);
  }
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

  console.log('Toolchain > Looking for source files...');
  ensureTsFileExists({ verbose: true });

  console.log('Toolchain > Adding values to package.json...');
  addScripts(verbose);

  console.log('Toolchain > Done.');
}
