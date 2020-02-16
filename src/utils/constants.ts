/* These configs are direct copies of the configs used in Toolchain itself. */
export const COPIED_CONFIGS: string[] = [
  '.github/workflows/node-check-code.yaml',
  '.github/workflows/node-prerelease.yaml',
  '.github/workflows/node-stable-release.yaml',
  '.skypilot/lib/tsconfig.base.json',
  '.skypilot/lib/tsconfig.generate-typings.base.json',
  'src/scripts/.eslintrc.js',
  '.editorconfig',
  '.eslintignore',
  '.eslintrc.js',
  '.gitignore',
  '.huskyrc.js',
  '.lintstagedrc.js',
  '.nvmrc',
  'babel.config.js',
  'jest.config.js',
  'jest.integration.config.js',
  'jest.standalone.config.js',
  'tsconfig.generate-typings.json',
  'tsconfig.json',
];

/* These configs are stored in the package (`THIS_PACKAGE_NAME/lib`) and referenced by
   other configs. */
export const REFERENCED_CONFIGS: string[] = [
  '.skypilot/lib/tsconfig.generate-typings.base.json',
  '.skypilot/lib/tsconfig.base.json',
];

export const REQUIRED_DEPENDENCIES: string[] = [
  '@babel/cli',
  '@babel/core',
  'eslint',
  'jest',
  'typescript',
];
