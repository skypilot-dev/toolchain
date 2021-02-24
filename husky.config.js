module.exports = {
  hooks: {
    'pre-commit': 'git-branch-is -r "(^wip|wip$)" 2>/dev/null || lint-staged',
  },
};
