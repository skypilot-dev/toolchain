import { LintStagedConfig, lintStagedConfigurator } from '../configurators/lintStagedConfigurator';

/* -- Constants -- */
export const defaultConfig = {
  '*.{js,ts}': [
    'eslint --cache',
  ],
};


describe('lintStagedConfigurator(:options)', () => {
  describe('When no options are passed', () => {
    const config: LintStagedConfig = lintStagedConfigurator();

    it('The return config should be the default config', () => {
      expect(config).toEqual(defaultConfig);
    });
  });

  describe('When empty options are passed', () => {
    const config: LintStagedConfig = lintStagedConfigurator({});

    it('The returned config should be the default config', () => {
      expect(config).toEqual(defaultConfig);
    });
  });

  describe('When a glob pattern is passed in the options', () => {
    const globPattern = '*.ts';
    const config: LintStagedConfig = lintStagedConfigurator({
      globPattern,
      cache: false,
      fix: true,
    });

    it('The glob pattern should be used in the config', () => {
      const hasGlobPattern = Object.prototype.hasOwnProperty.call(config, globPattern);
      expect(hasGlobPattern).toBe(true);
    });

  });
  describe('When { cache: false } is passed in the options', () => {
    const globPattern = '*.ts';
    it('The linting command should not have the `--cache` parameter', () => {
      const config: LintStagedConfig = lintStagedConfigurator({
        globPattern,
        cache: false,
        fix: false,
      });
      const expectedCommand = ['eslint'];
      expect(config[globPattern]).toEqual(expectedCommand)
    });
  });

  describe('When { cache: true } is passed in the options', () => {
    const globPattern = '*.ts';
    it('The linting command should have the `--cache` parameter', () => {
      const config: LintStagedConfig = lintStagedConfigurator({
        globPattern,
        cache: true,
      });
      const expectedCommand = ['eslint --cache'];
      expect(config[globPattern]).toEqual(expectedCommand)
    });
  });

  describe('When { fix: true } is passed in the options', () => {
    const globPattern = '*.ts';
    it('The linting command should have the `--fix` parameter', () => {
      const config: LintStagedConfig = lintStagedConfigurator({
        globPattern,
        cache: false,
        fix: true,
      });
      const expectedCommand = ['eslint --fix'];
      expect(config[globPattern]).toEqual(expectedCommand)
    });
  });

});
describe('When { fix: false } is passed in the options', () => {
  const globPattern = '*.ts';
  it('The linting command should not have the `--fix` parameter', () => {
    const config: LintStagedConfig = lintStagedConfigurator({
      globPattern,
      cache: false,
      fix: false,
    });
    const expectedCommand = ['eslint'];
    expect(config[globPattern]).toEqual(expectedCommand)
  });
});
