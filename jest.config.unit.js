/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./jest.config');

module.exports = Object.assign({},
  baseConfig,
  {
    testRegex: '((src|tests)/.*.unit.test.ts$)',
  },
);
