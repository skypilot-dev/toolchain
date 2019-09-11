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
// const isDirty = '[ -n "$(git status --porcelain)" ]'
const stashNeeded = '{ { [ -n "$(git status --porcelain)" ] && HUSKY_RESTORE_NEEDED=1; } || { echo "Toolchain > Working tree clean, nothing to stash" && false; }; }';
const restoreNeeded = '{ { [ -n "$HUSKY_RESTORE_NEEDED" ]; } || { echo "Toolchain > Nothing was stashed, skipping restore" && false; }; }';

const saveExitCode = 'EXIT_CODE=$?';
const exitWithSavedCode = 'exit $EXIT_CODE';

/* This command saves all staged and unstaged (including untracked) files to a stash and then
 * clears the working directory. */
const stash = 'echo "Toolchain > Stashing" && git stash --include-untracked --quiet';

/* This command saves all staged and unstaged (including untracked) files to a stash and then
 * clears unstaged files (but not staged files) from the working directory. */
const stashBeforeCommit = 'touch "${TMPDIR}/.HUSKY_POP_STASH"; git stash --include-untracked --keep-index --quiet';

/* This command saves the status code returned by the tasks, removes the temporary file that
 * signifies that the stash needs to be restored, applies and deletes the stash, and then exits
 * with the saved status code. */
const popStash = '{ status=$?; echo "Toolchain > Restoring the stash"; rm -f "${TMPDIR}/.HUSKY_POP_STASH"; git stash pop --quiet; exit $status; }';

/* This command restores unstaged files and patches. */
const popStashAfterSuccessfulCommit = 'test ! -f "${TMPDIR}/.HUSKY_POP_STASH" && echo "Toolchain > Skipping post-commit" && exit 0 || rm -f "${TMPDIR}/.HUSKY_POP_STASH"; git checkout stash --quiet -- .; git stash pop --quiet; git reset --quiet';

/* -- Helper functions -- */
function alwaysDo(command) {
  return '; ' + command;
}

/* Create a group of commands by enclosing them in braces. */
function group(command) {
  return '{ ' + command + '; }';
}

function joinCommands(commands) {
  return commands.join(' && ');
}

function groupAndJoin(commands) {
  return group(joinCommands(commands));
}

/* Use this sequence to wrap commits. If the commit is unsuccessful, the stash is simply popped.
 * If the commit is successful, staged files will have been moved to the commit; the unstaged files
 * and partials will be restored by `popStashAfterSuccessfulCommit` in the post-commit hook. */
function stashWithRestoreOnFailure(command) {
  return '{ ' + joinCommands([stashBeforeCommit, command]) + '; }'
    + ' || { ' + popStash + '; }';
}
/* -- End of helper functions */


const checkTypes = `tsc --project tsconfig.json --incremental --outDir ${tmpDir} --tsBuildInfoFile ${tmpDir}/.tsBuildInfo`;
const runTests = '{ { [ -e ${TMPDIR}/$(git rev-parse --verify HEAD) ] && echo "Toolchain > Skipping tests. This commit has already passed."; } || { yarn run test --silent && touch ${TMPDIR}/$(git rev-parse --verify HEAD); }; }';

/* The tasks to run before committing. */
const preCommitTasks = [
  'lint-staged',
  checkTypes,
];

module.exports = {
  hooks: {
    'pre-commit': stashWithRestoreOnFailure(joinCommands(preCommitTasks)),
    'post-commit': popStashAfterSuccessfulCommit,
    'pre-push': groupAndJoin([stashNeeded, stash])
      + alwaysDo(runTests)
      + alwaysDo(saveExitCode)
      + alwaysDo(groupAndJoin([restoreNeeded, popStash]))
      + alwaysDo(exitWithSavedCode),
  },
};
