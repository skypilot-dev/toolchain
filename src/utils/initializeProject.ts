/* eslint-disable no-console */

/* -- Imports -- */
import path from 'path';

import { bulkReadTransformWrite, makeSourcesAndTargetsArray } from './bulkReadTransformWrite';
import { CONFIGS, CONFIG_TEMPLATES, CONFIGURATOR_CONFIGS } from './constants';
import { makeReplaceFn } from './makeReplaceFn';
import { parsePathToPackage } from './parsePathToPackage';
import { updatePackageFile } from './updatePackageFile';


/* -- Typings -- */

/* These options are used in testing. */
interface InitializeProjectOptions {
  sourceDir?: string;
  targetDir?: string;
  projectDir?: string;
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
const verbose = true;


/* -- Main subfunctions -- */

/* Add scripts to the package file. */
function addScripts(): void {
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
  files = [...CONFIGS, ...CONFIGURATOR_CONFIGS],
}): void {
  const sourcesAndTargets = makeSourcesAndTargetsArray(files);
  bulkReadTransformWrite({ sourceDir, targetDir, sourcesAndTargets, verbose });
}

/* Remove the `-template` suffix from these files, replace `<PATH-TO-PACKAGE>` with the path to
   this package (under `node_modules/`), then copy them to the project. */
export function injectPathAndCopyToProject({ sourceDir = packageDir, targetDir = projectDir, files = CONFIG_TEMPLATES }): void {
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
  } = options;

  console.log('Toolchain > Creating configuration files...');
  copyToProject({ sourceDir, targetDir });
  injectPathAndCopyToProject({ sourceDir, targetDir });

  console.log('Toolchain > Adding values to package.json...');
  addScripts();

  console.log('Toolchain > Done.');
}
