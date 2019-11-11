/* -- Imports -- */
import { HuskyConfig, huskyConfigurator } from '../configurators/huskyConfigurator';


/* -- Constants -- */
export const defaultConfig = {
  hooks: {
    'pre-commit': 'git-branch-is -r "^wip|wip$" 2>/dev/null || lint-staged',
  },
};


/* -- Test suite -- */
describe('huskyConfigurator(:options)', () => {
  describe('When no options are passed', () => {
    const config: HuskyConfig = huskyConfigurator();

    it('The return config should be the default config', () => {
      expect(config).toEqual(defaultConfig);
    });
  });
});
