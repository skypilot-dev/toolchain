module.exports = {
  comments: false,
  presets: [
    '@babel/preset-typescript',
    [
      /* `preset-env` automatically selects the syntax transforms & browser polyfills (if
       *  applicable) needed by the target environments. */
      '@babel/preset-env', {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-numeric-separator',
    '@babel/proposal-object-rest-spread',
  ],
};
