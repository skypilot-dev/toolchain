import { readFileSync, writeFileSync } from 'fs';

const pathToPackageFile = './package.json';

function merge(targetObj: object, obj: object): object {
  return Object.assign({}, targetObj, obj);
}

function readPackageFile(): object {
  const pkgJson = readFileSync(pathToPackageFile, 'utf-8');
  return JSON.parse(pkgJson);
}

export function updatePackageFile(data: object): void {
  const pkg = readPackageFile();
  const mergedPkg = merge(pkg, data);
  writeFileSync(pathToPackageFile, JSON.stringify(mergedPkg, undefined, 2));
}
