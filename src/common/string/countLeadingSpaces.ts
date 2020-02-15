/* This function is copied, rather than imported, from `@skypilot/sugarbowl` to avoid creating
 * a cyclic dependency. */

import { MaybeNull } from '../types';

export function countLeadingSpaces(str: string): number {
  const pattern = new RegExp('^( *)');
  const matches: MaybeNull<RegExpMatchArray> = str.match(pattern) || null;
  if (!matches) {
    return 0;
  }
  return matches[0].length;
}
