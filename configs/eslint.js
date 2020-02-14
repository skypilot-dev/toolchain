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
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-dupe-class-members': 'error',
      },
    },
    {
      files: ['**/*.test.[jt]s'],
      rules: {
        'import/no-extraneous-dependencies': ['warn', { devDependencies: true }],
        'no-console': 'off',
      },
    },
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint',
    'import',
    'jest',
  ],
  rules: {
    // Possible errors
    'no-console': 'warn',

    // Best practices
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_', ignoreRestSiblings: true }],

    // Stylistic
    '@typescript-eslint/indent': ['warn', 2],
    '@typescript-eslint/member-delimiter-style': 'warn',
    '@typescript-eslint/member-ordering': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    'arrow-parens': 'off',
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
      imports: 'always-multiline',
      objects: 'always-multiline',
    }],
    'curly': 'error',
    'import/order': ['warn',
      { 'groups': ['builtin', 'external', 'internal', 'parent', 'sibling'] },
    ],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
    'no-dupe-class-members': 'off',
    'no-trailing-spaces': 'warn',
    'no-underscore-dangle': ['warn', { allowAfterThis: true }],
    'object-curly-newline': ['warn', { consistent: true }],
    'padded-blocks': 'off',
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
};
