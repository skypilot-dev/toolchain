/* Checks that all expected configs exist */
import fs from 'fs';

import { CONFIG_TEMPLATES } from '../utils/constants';


describe('Referenced configs', () => {
  CONFIG_TEMPLATES.forEach((config) => {
    describe(`'${config}'`, () => {
      it('should exist', () => {
        const exists = fs.existsSync(config);
        expect(exists).toBe(true);
      });

      it("should have a relative path to the file that starts with '/configs/'", () => {
        const content = fs.readFileSync(config, 'utf-8');
        expect(content).toContain('./configs/');
      });
    });

  });
});
