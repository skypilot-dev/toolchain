/* eslint-disable @typescript-eslint/explicit-function-return-type */
const os = require('os');

const { createHash } = require('crypto');

function computeHash(stringToHash) {
  const hash = createHash('md5')
    .update(stringToHash)
    .digest('hex');
  return hash.slice(0, 8);
}

const packageName = require('./package.json').name;
const cleanPackageName = packageName
  .replace('@', '')
  .replace('/', '-');
const dirNameHash = computeHash(__dirname);
const tmpDir = `${os.tmpdir()}/${cleanPackageName}-${dirNameHash}`;

/* -- Command definitions -- */
/* This command stashes all staged and unstaged (including untracked) files. */
const stash = 'git stash --include-untracked --keep-index --quiet';

/* These commands save the status code returned by the tasks, apply and delete the stash,
 * and then exit with the saved status code. */
const popStash = 'status=$?; git stash pop --quiet; exit $status';

/* These commands restore unstaged files and patches. */
const popStashAfterSuccessfulCommit = 'git checkout stash --quiet -- .; git stash pop --quiet; git reset --quiet';

/* -- Helper functions -- */
function joinTasks(tasks) {
  return tasks.join(' && ');
}

/* Use this sequence to wrap commits. If the commit is unsuccessful, the stash is simply popped.
 * If the commit is successful, staged files will have been moved to the commit, so restore only
 * the unstaged files & partials. */
function stashWithRestoreOnFailure(command) {
  return '(' + joinTasks([stash, command]) + ')'
    + ' || ( ' + popStash + ' )';
}
/* -- End of helper functions */


const checkTypes = `tsc --project tsconfig.json --incremental --outDir ${tmpDir} --tsBuildInfoFile ${tmpDir}/.tsBuildInfo`;

/* The tasks to run before committing. */
const preCommitTasks = [
  'lint-staged',
  checkTypes,
];



module.exports = {
  hooks: {
    'pre-commit': stashWithRestoreOnFailure(joinTasks(preCommitTasks)),
    'post-commit': popStashAfterSuccessfulCommit,
  },
};
