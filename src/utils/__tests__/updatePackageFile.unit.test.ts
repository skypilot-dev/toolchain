import { writeFileSync } from 'fs';

import tmp from 'tmp';

import { JsonObject } from '../../common/types';

import { readPackageFile, updatePackageFile, UpdateStrategy } from '../updatePackageFile';

function createTmpPkgFile(data: JsonObject, suffix: string): string {
  const pathToFile = `${tmp.fileSync().name}-${suffix}`;
  writeFileSync(pathToFile, JSON.stringify(data));
  return pathToFile;
}


describe('updatePackageFile()', () => {
  const initialPkg = {
    array: ['item'],
    object: {
      nestedString1: 'nested string 1',
      nestedString2: 'nested string 2',
    },
    string: 'string',
  };
  describe('when updateStrategy = MERGE', () => {
    const pathToFile = createTmpPkgFile(initialPkg, 'merge-test');
    const updateStrategy = UpdateStrategy.merge;

    describe('given nested entries under a key:object that already exists', () => {
      it('should merge the entries into the object', () => {
        const merge = {
          object: {
            nestedString2: 'replacement nested string',
            newNestedString: 'new nested string',
          },
        };

        updatePackageFile(merge, { pathToFile, updateStrategy });

        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toEqual({
          array: ['item'],
          object: {
            nestedString1: 'nested string 1',
            nestedString2: 'replacement nested string',
            newNestedString: 'new nested string',
          },
          string: 'string',
        });
      });
    });

    describe('given a key:array entry', () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'array-test');
      it("should create the array if it doesn't exist", () => {
        const merge = {
          newArray: ['new item', 'new item', ['new nested item']],
        };

        updatePackageFile(merge, { pathToFile, updateStrategy });

        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toMatchObject({
          array: ['item'],
          newArray: ['new item', 'new item', ['new nested item']],
          object: {
            nestedString1: 'nested string 1',
            nestedString2: 'nested string 2',
          },
          string: 'string',
        });
      });

      it('should add the value to an existing array', () => {
        const merge = {
          array: ['new item'],
        };

        updatePackageFile(merge, { pathToFile, updateStrategy });

        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toMatchObject({
          array: ['item', 'new item'],
          object: {
            nestedString1: 'nested string 1',
            nestedString2: 'nested string 2',
          },
          string: 'string',
        });
      });
    });
  });

  describe('when updateStrategy = CREATE', () => {
    const initialPkg = {
      array: ['item'],
      string: 'string',
    };
    const updateStrategy = UpdateStrategy.create;

    describe('given two keys, none of which exists', () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'create-0');

      it('should merge in both keys', () => {
        const create = {
          newArray: ['new item'],
          newObject: {
            newNestedNumber: 1,
          },
        };

        updatePackageFile(create, { pathToFile, updateStrategy });

        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toMatchObject({
          array: ['item'],
          newArray: ['new item'],
          newObject: {
            newNestedNumber: 1,
          },
          string: 'string',
        });
      });
    });

    describe('given two keys, one of which already exists', () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'create-1');
      const create = {
        array: ['replacement item'],
        newArray: ['new item'],
      };

      updatePackageFile(create, { pathToFile, updateStrategy });

      it('should merge in only the new key', () => {
        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toMatchObject({
          array: ['item'],
          newArray: ['new item'],
          string: 'string',
        });
      });
    });

    describe('given two keys, both of which exist', () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'create-2');
      const update = {
        string: 'replacement string',
        array: ['replacement item'],
      };

      updatePackageFile(update, { pathToFile, updateStrategy });

      it('should do nothing', () => {
        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toMatchObject(initialPkg);
      });
    });

    describe('given an empty object', () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'empty');
      const update = {};

      updatePackageFile(update, { pathToFile, updateStrategy });

      it('should do nothing', () => {
        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toMatchObject(initialPkg);
      });
    });
  });

  describe('when updateStrategy = REPLACE', () => {
    const initialPkg = {
      array: ['item'],
      object: { nestedString: 'nested string' },
      string: 'string',
    };
    const updateStrategy = UpdateStrategy.replace;

    describe("given two entries whose keys don't exist", () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'replace-0');

      it('should add both keys', () => {
        const update = {
          newArray: ['new item'],
          newObject: { newNestedNumber: 1 },
        };

        updatePackageFile(update, { pathToFile, updateStrategy });

        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toEqual({
          array: ['item'],
          newArray: ['new item'],
          newObject: { newNestedNumber: 1 },
          object: { nestedString: 'nested string' },
          string: 'string',
        });
      });
    });

    describe('given two keys, one of which already exists', () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'replace-1');
      const update = {
        array: ['replacement item'],
        newObject: { newNestedString: 'new nested string' },
      };

      updatePackageFile(update, { pathToFile, updateStrategy });

      it('should add the new key and replace the old key', () => {
        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toMatchObject({
          array: ['replacement item'],
          object: { nestedString: 'nested string' },
          newObject: { newNestedString: 'new nested string' },
          string: 'string',
        });
      });
    });

    describe('given an empty object', () => {
      const pathToFile = createTmpPkgFile(initialPkg, 'empty');
      const update = {};

      updatePackageFile(update, { pathToFile, updateStrategy });

      it('should do nothing', () => {
        const updatedPkg = readPackageFile(pathToFile);
        expect(updatedPkg).toEqual(initialPkg);
      });
    });
  });
});
