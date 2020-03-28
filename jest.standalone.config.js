const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testRegex: '__tests__/.*.(app|comp|unit).test.ts$',
};
