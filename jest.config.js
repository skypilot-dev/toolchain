module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  testRegex: '__tests__/.*.test.ts$',
  /* Define preprocessors */
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  verbose: false,
};
