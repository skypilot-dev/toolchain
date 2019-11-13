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

The linter runs automatically on each commit. Branches beginning with `wip-` or ending with `-wip`
are not linted.

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

### Coming soon

- Toolchain will auto-configure a project to support a CI workflow using GitHub actions
