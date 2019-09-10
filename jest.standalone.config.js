const baseConfig = require('./jest.config');

module.exports = Object.assign({},
  baseConfig,
  {
    testRegex: '((src|tests)/.*.(app|comp|unit).test.ts$)',
  },
);
