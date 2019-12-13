/* Checks that all expected configs exist */
import fs from 'fs';

import { REFERENCED_CONFIGS } from '../utils/constants';


describe('Referenced configs', () => {
  REFERENCED_CONFIGS.forEach((config) => {
    it(`'${config}' should exist`, () => {
      const exists = fs.existsSync(config);
      expect(exists).toBe(true);
    });
  });
});
