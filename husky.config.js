const tasks = (array) => array.join(' && ');

module.exports = {
  hooks: {
    'pre-commit': tasks([
      'lint-staged',
    ]),
  },
};
