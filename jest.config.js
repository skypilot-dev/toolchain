module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  testRegex: '((src|__tests__)/.*.test.ts$)',
  /* Define preprocessors */
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  verbose: false,
};
