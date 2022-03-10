import { grant, parse } from './deps.ts';
import { initHooks } from './src/init.ts';
import { validate } from './src/util/args.ts';
import { Logger } from './src/util/logger.ts';
import { deno } from './src/util/run.ts';

// Define the constants of the application.
const version = '1.0.0';

// Define the state of the application.
export const logger: Logger = new Logger();

/** The allowed flags and their aliases. This is used by the {@link validate} function. */
const allowedArgs = [
  'h',
  'help',
  'dry-run',
  'verbose',
  'v',
  'quiet',
  'q',
  'version',
];

/**
 * The main logic of the script. This is where the magic happens.
 */
async function main(): Promise<void> {
  // Build the permission runtime for the software.
  await grant({
    id: 'run.deno',
    descriptor: { name: 'run', command: 'deno' },
    options: { prompt: true, require: true },
  });
  await grant({
    id: 'run.git',
    descriptor: { name: 'run', command: 'git' },
    options: { prompt: true, require: true },
  });
  await grant({
    id: 'read.git',
    descriptor: { name: 'read', path: '.git' },
    options: { prompt: true, require: true },
  });
  await grant({
    id: 'read.git-hooks',
    descriptor: { name: 'read', path: '.git-hooks' },
    options: { prompt: true, require: true },
  });
  await grant({
    id: 'write.git-hooks',
    descriptor: { name: 'write', path: '.git-hooks' },
    options: { prompt: true, require: true },
  });

  // Convert and validate the Deno.args to a more useful format.
  const args = parse(Deno.args, {
    unknown: (arg, key) => validate(allowedArgs, arg, key),
  });

  // Set the logging mode from the arguments.
  if (args.verbose || args.v) logger.setState(true, true);
  if (args.quiet || args.q) logger.setState(false, false);

  // If the user wants to see the help message, print it and exit.
  if (args.help || args.h) {
    usageBanner();
    Deno.exit(0);
  }

  // If the user wants to see the version, print it and exit.
  if (args.version) {
    versionBanner();
    Deno.exit(0);
  }

  // Print the initial banner.
  logger.basic(`Preparing to install the git-hooked environment...`);

  // Handle the different modes.
  const command = args._.shift() ?? 'install';
  switch (command) {
    case 'upgrade': {
      logger.basic('Upgrading git-hooked installation via deno cli ...');
      // > deno cache --no-check=remote --reload https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts
      // > deno install --no-check=remote --allow-run=deno,git --allow-write=./.git-hooks/ --allow-read=./.git-hooks/,./.git/ -f -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts
      logger.detailed('Running: deno cache --no-check=remote --reload');
      await deno([
        'cache',
        '--no-check=remote',
        '--reload',
        'https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts',
      ]);
      logger.detailed(
        'Running: deno install --no-check=remote [...] -f -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts',
      );
      await deno([
        'install',
        '--no-check=remote',
        '--allow-run=deno,git',
        '--allow-write=./.git-hooks/',
        '--allow-read=./.git-hooks/,./.git/',
        '-f',
        '-n',
        'git-hooked',
        'https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts',
      ]);
      logger.basic('Upgrade of git-hooked has finished successfully.');
      break;
    }
    case 'uninstall': {
      logger.basic('Removing git-hooked from the current workspace ...');
      // await deinitHooks(args['dry-run'] ? false : true);
      logger.basic('Removal of git-hooked has finished successfully.');
      break;
    }
    default: {
      logger.basic('Installing git-hooked to the current workspace ...');
      await initHooks(args['dry-run'] ? false : true);
      logger.basic('Installation of git-hooked has finished successfully.');
      break;
    }
  }
}

/**
 * Show the command usage banner.
 */
function usageBanner() {
  logger.always(`
Deno Git-Hooks Runner
  Register and configure the git-hooks for arbitrary commands and user scripting. Useful for automation of lint, fmt, tests, and enforcing development standards.

INSTALL:
  > deno install -f --no-check=remote --allow-run=git --allow-write=./.git-hooks/ --allow-read=./.git-hooks/,./.git/ -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts

UPGRADE:
  > git-hooked upgrade

USAGE:
  git-hooked [command] [options]

COMMANDS
  install                        Install the git-hooked environment. This is selected by default.
  upgrade                        Upgrade the git-hooked cli from the remote repository. This will install the latest versioned release.
  uninstall                      Remove the git-hooked environment and the associated git configuration changes. This will not remove individual scripts.

OPTIONS:
  -h, --help                     Show this help message.
  -v, --verbose                  Print additional output of the steps taken by the script. Quiet takes precedence.
  -q, --quiet                    Disregard all non-error output. This takes precedence over verbose.
  --dry-run                      Print the commands that would be executed that make changes, but don't execute them. Certain commands are executed for parsing.

EXIT CODES:
  0                              Successfully executed based on the provided arguments.
  4                              One or more arguments were invalid or incompatible.

If no options are specified, the default behavior is to propogate to all supported git-hooks. This script will never override any existing git-hooks, but hooks not created under '.git-hooked' will no longer execute.
`);
}

/**
 * Show the version and information banner.
 */
function versionBanner() {
  logger.always(`
Deno Git-Hooks Runner - git-hooked - Version v${version}.

Available under the MIT License. Copyright 2022 for Amethyst Studio on behalf of Samuel J Voeller (xCykrix).
https://opensource.org/licenses/MIT

The source code is available at: https://github.com/amethyst-studio/git-hooked
Versioned with: https://deno.land/x/git-hooked

Inspired by Husky for Node.js: https://github.com/typicode/husky
`);
}

/**
 * The entry point of the script when called directly from cli.
 */
if (import.meta.main) {
  main();
}
