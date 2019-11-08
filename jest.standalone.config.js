const baseConfig = require('./jest.config');

module.exports = Object.assign({},
  baseConfig,
  {
    testRegex: '__tests__/.*.(app|comp|unit).test.ts$',
  },
);
