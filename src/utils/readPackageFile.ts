import fs from 'fs';
import { JsonObject, JsonValue } from '../common/types';
import { findUpTree } from '../filesystem/findUpTree';

type MaybeUndefined<T> = T | undefined;

export interface DependencyMap {
  [name: string]: string;
}

export interface PackageFile extends JsonObject {
  [key: string]: MaybeUndefined<JsonValue>;
  dependencies?: { [name: string]: string };
  devDependencies?: DependencyMap;
  peerDependencies?: DependencyMap;
  scripts?: { [key: string]: string };
  version: string;
}

/* Reads & returns a value from the project's package file. */
export function readPackageFile(pathToFile?: string): PackageFile {
  const packageFilePath = pathToFile || findUpTree('package.json');
  const packageFileAsJson = fs.readFileSync(packageFilePath, 'utf-8');
  return JSON.parse(packageFileAsJson);
}
