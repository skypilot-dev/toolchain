export function parsePathToPackage(fullPath: string): string {
  return `node_modules/${fullPath.split('/node_modules/')[1]}`;
}
