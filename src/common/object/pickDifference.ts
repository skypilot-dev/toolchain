/* Given two objects, return the entries in the first object whose keys do not exist in the 2nd */
import { JsonObject } from '../types';

export function pickDifference(objToFilter: JsonObject, filteringObj: JsonObject): JsonObject {
  if (Array.isArray(objToFilter) || Array.isArray(filteringObj)) {
    throw new Error('Invalid argument: Both arguments must be JSON objects');
  }

  const keys = Object.keys(objToFilter);
  const disallowedKeys = Object.keys(filteringObj);

  const filteredObj = keys
    .filter((key) => !disallowedKeys.includes(key))
    .reduce((obj, key) => ({
      ...obj,
      [key]: objToFilter[key],
    }), {});
  return filteredObj;
}
