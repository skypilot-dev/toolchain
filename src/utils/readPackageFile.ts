import fs from 'fs';
import { JsonObject } from '../common/types';
import { findUpTree } from '../filesystem/findUpTree';

/* Reads & returns a value from the project's package file. */
export function readPackageFile(pathToFile?: string): JsonObject {
  const packageFilePath = pathToFile || findUpTree('package.json');
  const packageFileAsJson = fs.readFileSync(packageFilePath, 'utf-8');
  return JSON.parse(packageFileAsJson);
}
