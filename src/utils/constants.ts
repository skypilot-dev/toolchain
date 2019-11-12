/* These configs are direct copies of the configs used in Toolchain itself. */
export const CONFIGS: string[] = [
  '.editorconfig',
  '.eslintignore',
  '.gitignore',
  'jest.config.js',
  'jest.integration.config.js',
  'jest.standalone.config.js',
  'configs/babel.js',
  'configs/eslint.js',
  'configs/tsconfig.generate-typings.json',
  'configs/tsconfig.main.json',
];

/* These configs contain variables that need replacement with values supplied by the consuming project. */
export const CONFIG_TEMPLATES: string[] = [
  'babel.config.js',
  '.eslintrc.js',
  'tsconfig.generate-typings.json',
  'tsconfig.json',
];

/* These configs use a configurator, which the consuming project must import from Toolchain. */
export const CONFIGURATOR_CONFIGS: string[] = [
  '.huskyrc.js',
  '.lintstagedrc.js',
];

