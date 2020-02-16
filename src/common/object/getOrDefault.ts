/* Copied from `@skypilot/sugarbowl` to avoid creating a cyclic dependency. */

import { MaybeUndefined } from '../types';

/* Given an object, a key, and a default value, return the value mapped to the key or, if the key
 * doesn't exist, the default value. */
export function getOrDefault<V>(obj: { [index: string]: V }, key: string, defaultValue?: V): MaybeUndefined<V> {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key] as V;
  }
  return defaultValue;
}
