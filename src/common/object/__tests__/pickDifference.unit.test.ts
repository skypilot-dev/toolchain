import { pickDifference } from '../pickDifference';

describe('pickDifference()', () => {
  it('given two objects with all keys in common, should return an empty object', () => {
    const objToFilter = { a: 1 };
    const filteringObject = { a: 2 };

    const filteredObj = pickDifference(objToFilter, filteringObject);
    expect(filteredObj).toEqual({});

  });

  it('given an empty object and an object, should return the empty object', () => {
    const objToFilter = {};
    const filteringObj = { a: 1 };

    const filteredObj = pickDifference(objToFilter, filteringObj);
    expect(filteredObj).toEqual(objToFilter);

  });

  it('given an object and an empty object, should return the first object', () => {
    const objToFilter = { a: 1 };

    const filteredObj = pickDifference(objToFilter, {});
    expect(filteredObj).toEqual(objToFilter);

  });

  it('given two objects with no keys in common, should return the first object', () => {
    const objToFilter = { a: 1 };
    const filteringObject = { b: 2 };

    const filteredObj = pickDifference(objToFilter, filteringObject);
    expect(filteredObj).toEqual(objToFilter);

  });

  it('given two objects with some common keys, should return the first object minus any keys that exist in the second', () => {
    const objToFilter = { a: 1, b: [], c: 'c' };
    const filteringObj = { b: null };

    const filteredObj = pickDifference(objToFilter, filteringObj);
    const expectedFilteredObj = { a: 1, c: 'c' };

    expect(filteredObj).toEqual(expectedFilteredObj);

  });
});
