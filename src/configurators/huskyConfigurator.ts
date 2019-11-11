/* -- Typings -- */
export interface HuskyConfig {
  hooks: {
    [hookName: string]: string;
  };
}

interface HuskyOptions {
  ignoreBranchRegex?: string;
}

export function huskyConfigurator({ ignoreBranchRegex = '^wip|wip$' }: HuskyOptions = {}): HuskyConfig {
  const preCommitCommand = [
    ignoreBranchRegex ? `git-branch-is -r "${ignoreBranchRegex}" 2>/dev/null` : '',
    'lint-staged',
  ].join(' || ');

  return {
    hooks: {
      'pre-commit': preCommitCommand,
    },
  };
}
