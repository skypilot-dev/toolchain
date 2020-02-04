import fs from 'fs';
import path from 'path';

interface FindUpTreeOptions {
  startAtDir?: string;
}

const ROOT_DIR = '/';

export function findUpTree(name: string, options: FindUpTreeOptions = {}): string {
  const {
    startAtDir = '', // assume that the search should start at the current working directory
  } = options;

  /* Start at this directory and go up the tree. */
  const deepestDir = path.resolve(startAtDir);
  const dirComponents = deepestDir.split('/');

  while (dirComponents.length > 0) {
    const directory = path.resolve(ROOT_DIR, dirComponents.join('/'));
    const fullPath = path.join(directory, name);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
    dirComponents.pop();
  }
  return '';
}
