# @skypilot/toolchain
Toolchain for Node projects:
- Babel
- ESLint
- Jest
- TypeScript
- Lint-Staged (using Husky)

With a pre-commit hook to enforce linting on commit.

### What does it do?
Toolchain installs all dependencies & configurations needed to start creating Node projects
using TypeScript. Compilation, typing, linting, and testing are pre-configured.


### How to install 
```
$ yarn add @skypilot/toolchain
$ yarn toolchain init
$ node node_modules/husky/husky.js install
```

The `toolchain init` command creates a set of configuration files that include scripts & configs
for distributing the project as a package. A planned change is to have `toolchain init` create only
the core files & configs. A separate command would add the files & configs for creating a package.

The `husky.js install` command is required because Yarn doesn't automatically run Husky's
post-install script. A friendlier situation is in the works.

### How to use

These run automatically on each commit:
- type-checking
- linting

These run automatically when a commit is pushed to a remote:
- testing

These run automatically when the package is published:
- type-checking
- testing
- building
- type-generation

In addition, these convenience scripts are added to `package.json` by `yarn toolchain init`:

- `build`: Builds the project for distribution as an NPM package
- `check-types`: Checks that all types in the project are valid
- `generate-typings`: Generates typings for the distribution
- `test`: An alias for `test:standalone`
- `test:all`: Run all tests using Jest
- `test:integration`: Run all integration tests (tests that rely on external services) using Jest
- `test:standalone`: Run all standalone tests (app, component, and unit tests, which do not rely
on external services) using Jest

To run a script, use `yarn run SCRIPT_NAME`.

### Known issues

These are known issues in the current version. The fixes (except the fix for #5) will be included
in a patch release in the near future.

1\. The initial commit to an empty repo will fail unless `--no-verify` is passed to the `git` command.

2\. All commits will fail (unless `--no-verify` is used) until the core configuration files are added
  to the repo, because they are needed for the commit hooks to run, and unstaged work is stashed
   during a commit. (A good practice is to commit the configuration files immediately after the
   initial commit.) These files are:
  - `.eslintrc.js`
  - `.huskyrc.js`
  - `.lintstagedrc.js`
  - `babel.config.js`
  - `jest.config.js`
  - `jest.standalone.js`
  - `tsconfig.json`

3\. All commits will fail (unless `--no-verify` is used) until the project has a `src` directory
  that contains at least one `.ts` file, because the type-checker throws an error when it can't
  find any source files.
