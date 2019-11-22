import { sortObjectEntries } from '../sortObjectEntries';

describe('sortJsonObject', () => {
  it('should sort the specified key:object', () => {
    const initialObj = {
      toSort: {
        b: 1,
        a: 2,
      },
      notToSort: {
        b: 1,
        a: 2,
      },
    };
    const sortedObj = sortObjectEntries(initialObj, ['toSort']);
    expect(sortedObj.toSort).toEqual({ a: 2, b: 1 });
    expect(sortedObj.notToSort).toEqual({ b: 1, a: 2 });
  });

  it('should sort the specified key:array', () => {
    const initialObj = {
      toSort: [
        'b',
        'a',
      ],
      notToSort: {
        b: 1,
        a: 2,
      },
    };
    const sortedObj = sortObjectEntries(initialObj, ['toSort']);
    expect(sortedObj.toSort).toEqual(['a', 'b']);
    expect(sortedObj.notToSort).toEqual({ b: 1, a: 2 });
  });
});
