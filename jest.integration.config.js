const baseConfig = require('./jest.config');

module.exports = Object.assign({},
  baseConfig,
  {
    testRegex: '__tests__/.*.int.test.ts$',
  },
);
