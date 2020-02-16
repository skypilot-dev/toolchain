import { JsonObject, JsonValue } from '../types';
import { sortObject } from './sortObject';

export function sortObjectEntries(jsonObject: JsonObject, keysToSort: string[]): JsonObject {
  if (keysToSort.length > 0) {
    keysToSort.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(jsonObject, key)) {
        return;
      }
      const value: JsonValue = jsonObject[key] as JsonValue;
      if (Array.isArray(value)) {
        jsonObject[key] = value.sort();
        return;
      }
      if (typeof value === 'object' && value !== null) {
        jsonObject[key] = sortObject(value);
      }
    });
  }
  return jsonObject;
}
