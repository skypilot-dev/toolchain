/* -- Imports -- */
import fs from 'fs';
import path from 'path';

import { readTransformWrite } from './readTransformWrite';


/* -- Typings -- */
type TransformFn = (rawTemplate: string) => string;

export interface BulkRtwOptions {
  sourceDir: string;
  targetDir: string;
  files: SourceAndTarget[];
  transformFn?: TransformFn;
}

export interface SourceAndTarget {
  sourceFile: string;
  targetFile?: string;
}


/* -- Functions -- */
/* Given an array of filenames, return an array of `SourceAndTarget` objects in which each filename
 * becomes a `sourceFile` value. */
export function makeSourcesAndTargetsArray(sourceFiles: string[]): SourceAndTarget[] {
  return sourceFiles.map((sourceFile) => ({ sourceFile }));
}

/* Copy files from sourcePath to destination, optionally applying a transform function */
export function bulkReadTransformWrite(options: BulkRtwOptions): void {
  const { sourceDir, targetDir, files, transformFn } = options;

  if (files.length < 1) {
    return;
  }

  /* Copy each template */
  files.forEach(({ sourceFile, targetFile = sourceFile }) => {
    const sourcePath = path.join(sourceDir, sourceFile);
    const targetPath = path.join(targetDir, targetFile);

    /* Identify & create the directory for the target file. This step is necessary because
     * `targetFile` can include a relative path, so `targetFileDir` may differ from `targetDir`. */
    const targetFileDir = path.dirname(targetPath);
    fs.mkdirSync(targetFileDir, { recursive: true }); // `recursive` requires Node v10+

    readTransformWrite(sourcePath, targetPath, transformFn);
  });
}
