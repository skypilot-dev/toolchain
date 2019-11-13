import fs from 'fs';
import path from 'path';

/* Given a directory and a file extension, return true if any file in the directory, or in any
   of its descendants, contains a file with that extension. */
export function dirHasMatchingFile(dir: string, pattern: RegExp): boolean {
  /* Get all entries in the directory. */
  const dirEntries = fs.readdirSync(dir, { withFileTypes: true });
  if (dirEntries.some((dirent) => dirent.isFile() && dirent.name.match(pattern))) {
    return true
  }

  /* Recursively check in subdirectories. */
  const subdirs = dirEntries.filter((dirent) => dirent.isDirectory());
  for (let i = 0; i < subdirs.length; i += 1) {
    const dirent = subdirs[i];
    const subDir = path.resolve(dir, dirent.name);
    if (dirHasMatchingFile(subDir, pattern)) {
      return true;
    }
  }
  return false;
}
