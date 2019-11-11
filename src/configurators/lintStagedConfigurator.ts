/* -- Typings -- */
export interface LintStagedConfig {
  [globPattern: string]: string[];
}

interface LintStagedOptions {
  cache?: boolean;
  fix?: boolean;
  globPattern?: string;
}


/* -- Functions -- */
export function lintStagedConfigurator({
  globPattern = '*.{js,ts}',
  cache = true,
  fix = false,
}: LintStagedOptions = {}): LintStagedConfig {

  const params = [];
  if (cache) {
    params.push('--cache');
  }
  if (fix) {
    params.push('--fix');
  }

  const command = [
    'eslint',
    ...params,
  ].join(' ');

  return {
    [globPattern]: [command],
  };
}
