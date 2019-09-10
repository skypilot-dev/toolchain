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

/* This command stashes all staged and unstaged (including untracked) files. */
const stashCommand = 'git stash --include-untracked --keep-index --quiet';

/* These commands save the status code returned by the tasks, apply and delete the stash,
 * and then exit with the saved status code. */
const stashPopOnFailure = 'status=$?; git stash pop --quiet; exit $status';

/* These commands restore unstaged files and patches. */
const stashPopOnSuccess = 'git checkout stash -- .; git stash pop; git reset';

/* The tasks to run before committing. */
const preCommitTasks = [
  // 'yarn run --silent check-types',
  `tsc --project tsconfig.json --incremental --outDir ${tmpDir} --tsBuildInfoFile ${tmpDir}/.tsBuildInfo`,
  'lint-staged',
];


const preCommit = '(' + stashCommand + ' && ' + preCommitTasks.join(' && ') + ')'
  + ' || ( ' + stashPopOnFailure + ' )';
const postCommit = stashPopOnSuccess;

module.exports = {
  hooks: {
    'pre-commit': preCommit,
    'post-commit': postCommit,
  },
};
