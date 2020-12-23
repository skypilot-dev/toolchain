#!/usr/bin/env node
import { exec } from 'child_process';
import util from 'util';
import { deindentTemplateLiteral } from '../common/string/deindentTemplateLiteral';

type MaybeUndefined<T> = T | undefined;

const args = process.argv.slice(2);
const HELP_FLAGS = ['--help', '-h', '-?'];

function hasIntersection<T>(array1: T[], array2: T[]): boolean {
  for (let i = 0; i < array1.length; i += 1) {
    const item = array1[i];
    if (array2.includes(item)) {
      return true;
    }
  }
  return false;
}

type ShowHelpAndExitOptions = {
  exitCode?: number;
  message?: string;
};

function showHelpAndExit(options: ShowHelpAndExitOptions): void {
  const { exitCode = 0, message } = options;
  const errorMessage = message ? `Error: ${message}` : 'Error';
  const usage = deindentTemplateLiteral`
  ${errorMessage}

  Usage: toolchain COMMAND

  Where COMMAND is one of:
    - init            create configuration files and package-file scripts
    - install-husky   install Husky Git hooks
  `;
  console.log(usage);
  process.exit(exitCode);
}

if (hasIntersection(args, HELP_FLAGS)) {
  showHelpAndExit({ exitCode: 0 });
}

if (args.length !== 1) {
  showHelpAndExit({ exitCode: 1 });
}

type Command = 'init';

function parsePackageManager(packageManager: MaybeUndefined<string>): string {
  if (!packageManager) {
    return '';
  }
  if (!packageManager.includes('/')) {
    return packageManager;
  }
  return packageManager.split('/')[0];
}

const validCommands = ['init', 'install-husky'];

const command = args[0];

if (!validCommands.includes(command)) {
  showHelpAndExit({ exitCode: 1, message: `Unknown command '${command}'` });
}

function getRunCmd(): string {
  const packageManager = parsePackageManager(process.env.npm_config_user_agent);
  switch (packageManager) {
    case 'yarn':
      return 'yarn --silent';
    case 'npm':
      return 'npx --no-install';
    case 'pnpm':
      return 'pnpx --no-install';
    default:
      throw new Error(`Unknown package manager: ${packageManager}`);
  }
}

const runCmd = getRunCmd();

const commandString = `${runCmd} toolchain-${(command as Command)}`;
const execAsync = util.promisify(exec);
(
  async () => {
    try {
      const { stderr, stdout } = await execAsync(commandString, {});
      if (stderr) {
        console.error(stderr);
        process.exit(1);
      }
      console.log(stdout.trim());
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
)();
