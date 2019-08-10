module.exports = {
  '*.{js,ts}': [
    'eslint',
  ],
  '*.{ts}': [
    'tsc --noEmit',
  ],
};
