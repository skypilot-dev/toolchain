#!/usr/bin/env node
/* -- Imports -- */
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

import { updatePackageFile } from '../utils/updatePackageFile';

const packageName = require('../../package.json').name;
// const projectRootDir = resolve(__dirname, '../..');


/* -- Helper functions -- */
function getProjectRootDir(): string {
  return resolve(__dirname).split('/node_modules')[0];
}


/* -- Constants -- */
const projectRootDir = getProjectRootDir();

const babelConfig = `module.exports = {
  extends: '${packageName}/babel.config',
};
`;

const eslintConfig = `module.exports = {
  extends: [
    './node_modules/${packageName}/eslint.config',
  ],
};
`;

const huskyConfig = `module.exports = require('${packageName}/husky.config');`;

const jestConfig = `module.exports = require('${packageName}/jest.config');
`;

const lintStagedConfig = `module.exports = require('${packageName}/lint-staged.config');`;

const configs = [
  { content: eslintConfig, outFile: '.eslintrc.js' },
  { content: babelConfig, outFile: 'babel.config.js' },
  { content: huskyConfig, outFile: '.huskyrc.js' },
  { content: jestConfig, outFile: 'jest.config.js' },
  { content: lintStagedConfig, outFile: '.lintstagedrc.js' },
];

console.log('Toolchain > Creating configuration files...');
configs.forEach(({ content, outFile }) => {
  writeFileSync(`${projectRootDir}/${outFile}`, content);
  console.log(`  Created ${outFile}`);
});

const templates = [
  { inFile: '.gitignore' },
  { inFile: 'tsconfig.generate-typings.json' },
  { inFile: 'tsconfig.main.json', outFile: 'tsconfig.json' },
];

const scripts: { key: string; value: string }[] = [
  { key: 'build', value: 'yarn run check-types && yarn test && yarn run build && yarn run generate-typings' },
  { key: 'check-types', value: 'tsc' },
  { key: 'generate-typings', value: 'tsc --project tsconfig.generate-typings.json' },
  { key: 'prepublishOnly', value: 'yarn run check-types && yarn test && yarn run build && yarn run generate-typings' },
  { key: 'test', value: 'jest' },
];

const srcDir = join(projectRootDir, 'src');
const entryFilePath = join(srcDir, 'index.ts');
const templateDir = resolve(__dirname, '../templates');


/* -- Script -- */
if (!existsSync(srcDir)) {
  mkdirSync(srcDir);
}
if (!existsSync(entryFilePath)) {
  writeFileSync(entryFilePath, 'export {}\n', )
}

templates.forEach(({ inFile, outFile = inFile }) => {
  copyFileSync(`${templateDir}/${inFile}`, `${projectRootDir}/${outFile}`);
  console.log(`  Created ${outFile}`);
});

console.log('Toolchain > Adding values to package.json...');
const newScripts = scripts.reduce((newScripts: { [key: string]: string }, { key, value }) => {
  newScripts[key] = value;
  console.log(`  Added ${key}: '${value}'`);
  return newScripts;
}, {});
updatePackageFile({ scripts: newScripts });

console.log('Toolchain > Done.');
