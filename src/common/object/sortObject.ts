import { JsonObject } from '../types';

export function sortObject(objToSort: JsonObject): JsonObject {
  return Object
    .entries(objToSort)
    .sort()
    .reduce((sortedObj: JsonObject, [key, value]) => {
      sortedObj[key] = value;
      return sortedObj;
    }, {});
}
