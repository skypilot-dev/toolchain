module.exports = {
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
  ],
  testRegex: '__tests__/.*.test.ts$',
  /* Define preprocessors */
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  verbose: false,
};
