/* This script copies templates to the `lib/` directory for distribution. */

import path from 'path';
import { bulkReadTransformWrite, makeSourcesAndTargetsArray } from '../src/utils/bulkReadTransformWrite';
import { COPIED_CONFIGS, REFERENCED_CONFIGS } from '../src/utils/constants';

/* -- Helper functions -- */
/* Resolve a path relative to the project root */
function resolvePath(relativePath = ''): string {
  const projectRoot = path.resolve(__dirname, '..');
  return path.resolve(projectRoot, relativePath);
}

/* -- Main functions -- */
/* Copy these files from this project to `lib/` (the distribution bundle). */
function copyToLib(): void {
  const sourceDir = resolvePath('.');
  const targetDir = resolvePath('lib');
  const sourcesAndTargets = makeSourcesAndTargetsArray([...COPIED_CONFIGS, ...REFERENCED_CONFIGS]);
  bulkReadTransformWrite({ sourceDir, targetDir, sourcesAndTargets })
}

copyToLib();
