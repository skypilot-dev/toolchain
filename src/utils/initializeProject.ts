/* eslint-disable no-console */

/* -- Imports -- */
import fs from 'fs';
import path from 'path';

import { JsonObject, JsonValue } from '../common/types';

import { bulkReadTransformWrite, makeSourcesAndTargetsArray } from './bulkReadTransformWrite';
import { COPIED_CONFIGS, CONFIG_TEMPLATES, CONFIGURATOR_CONFIGS } from './constants';
import { dirHasMatchingFile } from './dirHasMatchingFile';
import { makeReplaceFn } from './makeReplaceFn';
import { parsePathToPackage } from './parsePathToPackage';
import { updatePackageFile, UpdatePackageFileOptions, UpdateStrategy } from './updatePackageFile';

/* -- Typings -- */
type PackageFileEntry = { key: string; value: JsonValue; options?: UpdatePackageFileOptions };

type ScriptEntry = { [key: string]: string };

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
const packageFileEntries: PackageFileEntry[] = [
  /* TODO: Allow public projects to be created. */
  {
    key: 'publishConfig',
    value: { access: 'restricted' },
    options: { updateStrategy: UpdateStrategy.create },
  },
  { key: 'files', value: ['/lib'], options: { updateStrategy: UpdateStrategy.create }},
  { key: 'main', value: 'lib/index.js', options: { updateStrategy: UpdateStrategy.replace }},
  { key: 'types', value: 'lib/index.d.ts', options: { updateStrategy: UpdateStrategy.replace }},
];

const scripts: ScriptEntry[] = [
  { key: 'all-ci-checks', value: 'yarn run all-cq-checks && yarn run build' },
  { key: 'all-cq-checks', value: 'yarn run typecheck && yarn run lint --quiet && yarn test' },
  { key: 'build', value: 'rm -rf lib && yarn run compile-ts' },
  { key: 'ci', value: 'yarn run all-ci-checks' },
  { key: 'compile-ts', value: "babel ./src --out-dir ./lib --extensions .ts --ignore '**/*.test.ts' --ignore '**/*.d.ts' && yarn run generate-typings"},
  { key: 'cq', value: 'yarn run all-cq-checks' },
  { key: 'generate-typings', value: 'tsc --project tsconfig.generate-typings.json' },
  { key: 'lint', value: "eslint --cache '**/*.{js,ts}'" },
  { key: 'prepublishOnly', value: 'yarn run typecheck && yarn run lint --quiet && yarn test && yarn run build' },
  { key: 'publish:default', value: 'yarn publish --non-interactive' },
  { key: 'tc', value: 'yarn run typecheck' },
  { key: 'test', value: 'jest' },
  { key: 'typecheck', value: 'tsc' },
];

const packageDir = path.resolve(__dirname, '..');
const projectDir = getProjectRootDir();
const relativePathToPackage = parsePathToPackage(packageDir);


/* -- Main subfunctions -- */

/* Add package-file entries (other than scripts) */
function addPackageFileEntries(verbose = false): void {
  /* Create a <key>:<value> object and pass it with `options` to the update function */
  packageFileEntries.forEach((packageFileEntry) => {
    const { key, value, options = {} } = packageFileEntry;
    const data: JsonObject = { [key]: value };
    updatePackageFile(data, options);
    if (verbose) {
      console.log(`  Added "${key}": ${JSON.stringify(value)} }`);
    }
  });
}

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
  updatePackageFile({ scripts: newScripts }, { keysToSort: ['scripts'] });
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

/* If the project doesn't contain a TypeScript file, create one at `src/index.ts` to allow
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


/* If the project doesn't contain a test, create one at `src/__tests__/index.app.test.ts` to allow
   testing to pass. */
export function ensureTestExists({
  targetDir = path.join(projectDir, 'src'),
  targetFile = 'index.app.test.ts',
  verbose = false,
}): void {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync((targetDir));
  } else {
    /* FIXME: The check here does not mirror the matching pattern used by Jest, which looks for
       *.test.ts files looks only in `__tests__` directories. */
    if (dirHasMatchingFile(targetDir, /\.test\.[jt]s$/)) {
      return;
    }
  }
  const testDir = path.join(targetDir, '__tests__');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync((testDir));
  }

  const target = path.join(testDir, targetFile);
  const minimalTest = `import * as module from '../index';

describe('index.ts', () => {
  it('should export a module', () => {
    expect(typeof module).toBe('object');
  });
});
`;
  fs.writeFileSync(target, minimalTest, { encoding: 'utf8' });
  if (verbose) {
    console.log(`  Created a test at 'src/__tests__/${targetFile}' in order to have at least one passing test`);
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

  console.log('Toolchain > Looking for tests...');
  ensureTestExists({ verbose: true });

  console.log('Toolchain > Adding values to package.json...');
  addPackageFileEntries(verbose);
  addScripts(verbose);

  console.log('Toolchain > Done.');
}
