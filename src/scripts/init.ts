#!/usr/bin/env node
import { writeFileSync } from 'fs';

const packageName = require('../../package.json').name;

const gitIgnore = `# Compiled & transpiled files
/lib/

# Editor directories and files
.idea
.vscode
*.suo
*.sw?

# Local-only files
.env.local
.env.*.local
/local/

# Node
/node_modules/
.lock-wscript
.node_repl_history
.npm
npm-debug.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# Runtime data
/pids/
*.pid
*.seed

# Temporary files
/tmp/
*.tmp
*.tmp.*

# Tests & coverage
.nyc_output/
/coverage/
lib-cov/

!.gitkeep
`;

const babelConfig = `module.exports = {
  extends: '${packageName}/babel.config',
};
`;

const eslintConfig = `module.exports = {
  extends: [
    './node_modules/${packageName}/eslint.config',
  ],
};
`;

const huskyConfig = `module.exports = require('${packageName}/husky.config');`;

const jestConfig = `module.exports = require('${packageName}/jest.config');
`;

const lintStagedConfig = `module.exports = require('${packageName}/lint-staged.config');`;

const configs = [
  { filename: '.eslintrc.js', content: eslintConfig },
  { filename: '.gitignore', content: gitIgnore },
  { filename: 'babel.config.js', content: babelConfig },
  { filename: 'husky.config.js', content: huskyConfig },
  { filename: 'jest.config.js', content: jestConfig },
  { filename: 'lint-staged.config.js', content: lintStagedConfig },
];

/* eslint-disable no-console */
console.log('Creating configuration files...');
configs.forEach((config) => {
  writeFileSync(`./${config.filename}`, config.content);
  console.log(`  Created ${config.filename}`);
});
console.log('Done.');
