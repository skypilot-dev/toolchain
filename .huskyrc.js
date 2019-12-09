require('@babel/register')({
  extensions: ['.js', '.ts'],
});
try {
  const { huskyConfigurator } = require('./src/configurators');
  module.exports = huskyConfigurator();
} catch (error) {
  console.log('Husky configurator not found, falling back to default pre-commit hook.');
  module.exports = {
    hooks: {
      'pre-commit': 'git-branch-is -r "(^wip|wip$)" 2>/dev/null || lint-staged',
    },
  };
}
