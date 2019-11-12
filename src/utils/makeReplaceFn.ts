/* Given an array of objects containing `searchFor` and `replaceWith` values, return a function
 * that performs all of the replacements. */

export interface Replacement {
  searchFor: string;
  replaceWith: string;
}
type ReplaceFn = (original: string) => string;

export function makeReplaceFn(replacements: Replacement[]): ReplaceFn {
  return (original: string): string => {
    let result = original;
    replacements.forEach((replacement) => {
      const { searchFor, replaceWith } = replacement;
      result = result.split(searchFor).join(replaceWith);
    });
    return result;
  };
}
