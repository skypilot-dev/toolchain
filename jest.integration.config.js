const baseConfig = require('./jest.config');

module.exports = Object.assign({},
  baseConfig,
  {
    testRegex: '((src|tests)/.*.int.test.ts$)',
  },
);
