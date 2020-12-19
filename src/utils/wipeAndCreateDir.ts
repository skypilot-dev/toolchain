import fs from 'fs';
import path from 'path';


function rmdirSyncRecursive(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const currentPath = path.join(dir, file);
      if (fs.lstatSync(currentPath).isDirectory()) { // recurse
        rmdirSyncRecursive(currentPath);
      } else { // delete file
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

/* Given a directory, delete the directory if it exists and create it again. */
export function wipeAndCreateDir(dir: string): void {
  if (fs.existsSync(dir)) {
    rmdirSyncRecursive(dir);
  }
  fs.mkdirSync(dir, { recursive: true });
}
