require('@babel/register')({
  extensions: ['.js', '.ts'],
});
const { lintStagedConfigurator } = require('./src/configurators');

module.exports = lintStagedConfigurator();
