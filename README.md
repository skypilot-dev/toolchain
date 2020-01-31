# @skypilot/toolchain
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

### How to create and publish releases

Toolchain automates the process of creating and releasing NPM packages. Two different types of
automated releases are supported:
- **Stable release**: Has an ordinary semver version number, such as `1.1.2`
- **Prerelease**: Has a version number with a version-tag suffix, such as `1.0.0-beta`

Toolchain performs the following steps when a release is created. If any step fails, the release is
halted.

- Runs all automated checks (typechecking, linting, and testing)
- Builds the package and generates types
- Bumps the version number in `package.json` and creates a `CHANGELOG.md` file
- Commits these changes to the current branch
- Creates a version tag
- Pushes the commit and tag to the same branch of the upstream remote, if one has been set

Publication to NPM is also automatic, but the timing depends on the type of release:

- **Stable release**: Published when the release commit is pushed to the `master` branch of the
upstream remote*
- **Prerelease**: Published immediately

* _This step will be automated in a future release of Toolchain_

#### To release a stable version of your package

1. Check out the `develop` branch at the commit you want to publish (if there are any changes in
the working tree, stash them)

2. Run `yarn bumped release <VERSION>`,  
  where `VERSION` is one of the following: `patch` | `minor` | `major` | `<VERSION_NUMBER>`  
  (Example: `$ yarn bumped release minor`)
3. Merge the branch into `master` and push to the upstream remote. The remote will publish the
  package.

#### To release a prerelease version of your package

Prerelease branches: `alpha`, `beta`, `next`

1. Check out any of the prerelease branches (`alpha`, `beta`, or `next`) at the commit you want to
publish (if there any changes in the working tree, stash them)
2. Run `yarn bumped release <VERSION_NUMBER>`  
  (Example: `$ yarn bumped release 1.0.0`)

The package will be published with a suffix and tag that are the same as the branch name. E.g.,
if version 1.0.0 is released from the `beta` branch,
- the version number will be `1.0.0-beta`
- the package will have the tag `beta`

