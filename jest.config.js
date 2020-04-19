module.exports = {
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
  ],
  moduleNameMapper: {
    'root/(.*)$': '<rootDir>/$1',
    'src/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: '__tests__/.*.test.ts$',
  /* Define preprocessors */
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  verbose: false,
};
