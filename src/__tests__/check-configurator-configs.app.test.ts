/* Checks that all expected configs exist */
import fs from 'fs';

import { CONFIGURATOR_CONFIGS } from '../utils/constants';


describe('Configurator configs', () => {
  CONFIGURATOR_CONFIGS.forEach((config) => {
    describe(`'${config}'`, () => {
      const filePath = `./templates/${config}`;
      it(`should exist at 'templates/${filePath}`, () => {
        const exists = fs.existsSync(filePath);
        expect(exists).toBe(true);
      });

      it('should have <PACKAGE-NAME> as a placeholder', () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toContain('<PACKAGE-NAME>');
      });
    });

  });
});
