/* Import the actual config used by this project. */
import config from '../../.huskyrc';

/* Import the default config created by this project as part of the distributable toolchain. */
import { defaultConfig } from './createHuskyConfig.unit.test';

/* TODO: Test whether the compiled code exists at `lib/lint-staged-config.js` */
describe('The Husky config for this project', () => {
  it('should be the same as the default config', () => {
    expect(config).toEqual(defaultConfig);
  });
});
