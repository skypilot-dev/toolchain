module.exports = {
  root: true,
  // Recognize global vars for these environments
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    // Possible errors
    'no-console': 'warn',

    // Best practices
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    'no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],

    // Stylistic
    '@typescript-eslint/indent': ['warn', 2],
    'arrow-body-style': ['warn', 'as-needed'],
    'arrow-parens': ['warn', 'always'],
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
      imports: 'always-multiline',
      objects: 'always-multiline',
    }],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['warn', 'always'],
    'no-trailing-spaces': 'warn',
    'padded-blocks': 'off',
    'quotes': ['warn', 'single'],
  },
};
