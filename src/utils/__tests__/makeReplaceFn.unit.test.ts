import { Replacement, makeReplaceFn } from '../makeReplaceFn';

describe('makeReplaceFn({ :searchFor, :replaceWith }[])', () => {
  it('should return a function that replaces `searchFor` with `replaceWith`', () => {
    const replacements: Replacement[] = [
      { searchFor: 'a', replaceWith: 'A' },
      { searchFor: 'b', replaceWith: 'B' },
    ];
    const original = 'aba';
    const expectedResult = 'ABA';

    const replaceFn = makeReplaceFn(replacements);
    const result = replaceFn(original);

    expect(result).toBe(expectedResult);
  });
});
