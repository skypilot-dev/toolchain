# @skypilot/toolchain

[![build](https://img.shields.io/github/workflow/status/skypilotcc/toolchain/Build%20&%20publish%20stable%20Node%20package?label=build)]()&nbsp;
[![npm](https://img.shields.io/npm/v/@skypilot/toolchain?label=npm)](https://www.npmjs.com/package/@skypilot/toolchain)&nbsp;
[![license: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)  

Toolchain for Node projects:
- Babel
- ESLint
- Jest
- TypeScript
- Lint-Staged (using Husky)
- Bumped (version release system)

With a pre-commit hook to enforce linting on commit.

## What does it do?
Toolchain installs all dependencies & configurations needed to start creating Node projects
using TypeScript. Compilation, typing, linting, testing, and release system are pre-configured.


## How to install
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

## How to use

Once Toolchain is installed and initialized:

- The linter will run automatically on each commit
  Note: Branches beginning with `wip-` or ending with `-wip` will not be linted

- ESLint, Jest, and TypeScript will automatically use the configurations created by Toolchain

GitHub Actions workflows will
- run code-quality checks on every push to GitHub (except `wip-` and `-wip` branches)
- publish an NPM package on every push to GitHub on the stable or prerelease branches

### How to publish releases

Toolchain creates GitHub Actions workflows that automate the process of creating and releasing
NPM packages. Two different types of automated releases are supported:

- **Stable release**: Has an ordinary semver version number, such as `1.1.2`
- **Prerelease**: Has a version number with a version-tag suffix and iteration number, such as
`1.0.0-beta.0`

The workflows are configured to automatically
- publish a stable release on every push to `master`
- publish a prerelease on every push to `alpha`, `beta`, or `next` branch

Toolchain performs the following steps when a release is created. If any step fails, the release is
halted.

- Runs all automated checks (typechecking, linting, and testing)
- Builds the package and generates types
- Determines the next version number (based on commit messages)
- Creates a version tag
- Publishes the package to NPM

For stable releases, the workflow also:

- Bumps the version number in `package.json`
- Updates `CHANGELOG.md`
- Commits these changes to the current branch

### Convenience scripts

These convenience scripts are added to `package.json` by `yarn toolchain init`:

- `all-ci-checks`: Locally run the status checks that are run by the continuous-integration workflow
- `all-cq-checks`: Run code-quality checks: linting, type-checking, and standalone tests
- `build`: Build the project for distribution as an NPM package
- `ci`: An alias for `all-ci-checks`
- `cq`: An alias for `all-cq-checks`
- `generate-typings`: Generate typings for the distribution
- `lint`: Run the linter
- `prepublishOnly`: Run all checks and build steps in preparation for publication to NPM
- `tc`: An alias for `typecheck`
- `test`: An alias for `test:standalone`
- `test:all`: Run all tests using Jest
- `test:integration`: Run all integration tests (tests that rely on external services) using Jest
- `test:standalone`: Run all standalone tests (app, component, and unit tests, which do not rely
- `typecheck`: Checks that all types in the project are valid
on external services) using Jest

To run a script, use `yarn run SCRIPT_NAME`.
