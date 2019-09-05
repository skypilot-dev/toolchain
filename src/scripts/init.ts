#!/usr/bin/env node
import { copyFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const packageName = require('../../package.json').name;
// const projectRootDir = resolve(__dirname, '../..');

function getProjectRootDir(): string {
  return resolve(__dirname).split('/node_modules')[0];
}

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
  { filename: '.eslintrc.js', content: eslintConfig },
  { filename: 'babel.config.js', content: babelConfig },
  { filename: 'husky.config.js', content: huskyConfig },
  { filename: 'jest.config.js', content: jestConfig },
  { filename: 'lint-staged.config.js', content: lintStagedConfig },
];

console.log('Creating configuration files...');
configs.forEach((config) => {
  writeFileSync(`${projectRootDir}/${config.filename}`, config.content);
  console.log(`  Created ${config.filename}`);
});

const templates = [
  { inFile: '.gitignore' },
];

const templateDir = resolve(__dirname, '../templates');

templates.forEach(({ inFile }) => {
  const outFile = inFile;
  copyFileSync(`${templateDir}/${inFile}`, `${projectRootDir}/${outFile}`);
  console.log(`  Created ${outFile}`);
});

console.log('Done.');
