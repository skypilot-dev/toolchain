import { sortObject } from '../sortObject';

describe('sortObject()', () => {
  const unsortedObj = { b: 2, a: [{ d: 'nested' }], c: 3 };
  const sortedObj = sortObject(unsortedObj);
  it('should return an object with sorted keys', () => {
    expect(Object.keys(sortedObj)).toEqual(['a', 'b', 'c']);
  });

  it('the sorted object should be equal to the original', () => {
    expect(sortedObj).toEqual(unsortedObj);
  });

  it('the sorted object should not be the same object as the original', () => {
    expect(sortedObj).not.toBe(unsortedObj);
  });
});
