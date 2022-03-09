import { parse } from './deps.ts';
import { initializePermissions } from './permission.ts';
import { initHooks } from './src/init.ts';
import { detect, CLICommand, validate } from './src/util/args.ts';
import { Logger } from './src/util/logger.ts';
import { deno } from "./src/util/run.ts";

// Define the constants of the application.
const version = '1.0.0';

// Define the state of the application.
export const logger: Logger = new Logger();

/** The allowed flags and their aliases. This is used by the {@link validate} function. */
const allowedArgs = [
  'h',
  'help',
  'c',
  'config',
  'dry-run',
  'list-hooks',
  'l',
  'list-scripts',
  's',
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
  const permissions = await initializePermissions([
    { id: 'run.deno', descriptor: { name: 'run', command: 'deno' } },
    { id: 'run.git', descriptor: { name: 'run', command: 'git' } },
    { id: 'read.git', descriptor: { name: 'read', path: './.git/' } },
    {
      id: 'read.git-hooks',
      descriptor: { name: 'read', path: './.git-hooks/' },
    },
    {
      id: 'write.git-hooks',
      descriptor: { name: 'write', path: './.git-hooks/' },
    },
  ], {
    request: true,
    require: true,
  });
  if (permissions.error === true) {
    logger.error(
      `The following permission(s) were not available as expected. They may not be specified via the Deno cli, or the prompt may have been denied if used.`,
    );
    for (const denied of permissions.denied) {
      logger.error(JSON.stringify(denied));
    }
    Deno.exit(128);
  }

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

  // Process the state of the arguments. Detect invalid or incompatible arguments.
  logger.detailed('Processing user-provided arguments...');
  const mode = detect((args._.shift() ?? 'install') as CLICommand, args);
  logger.detailed(`Found selection mode as -> ${mode}`);

  // Handle the different modes.
  switch (mode) {
    case 'full_install':
    case 'dry_install': {
      logger.basic('Installing git-hooked to ./.git/ ...');
      await initHooks(mode);
      break;
    }
    case 'upgrade': {
      logger.basic('Upgrading git-hooked installation via deno cli ...');
      // > deno cache --no-check=remote --reload https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts
      // > deno install --no-check=remote --allow-run=deno,git --allow-write=./.git-hooks/ --allow-read=./.git-hooks/,./.git/ -f -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts 
      logger.detailed('Running deno cache --no-check=remote --reload ...');
      await deno(['cache', '--no-check=remote', '--reload', 'https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts']);
      logger.detailed('Running deno install --no-check=remote --allow-run=deno,git --allow-write=./.git-hooks/ --allow-read=./.git-hooks/,./.git/ -f -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts ...');
      await deno(['install', '--no-check=remote', '--allow-run=deno,git', '--allow-write=./.git-hooks/', '--allow-read=./.git-hooks/,./.git/', '-f', '-n', 'git-hooked', 'https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts']);
      logger.basic('Upgrade of git-hooked installation completed.');      
      break;
    }
    case 'list_hooks_and_scripts':
      logger.detailed(
        'List-hooks and list-scripts mode selected. Continuing...',
      );
      // listHooks();
      // listScripts();
      break;
    case 'list_hooks':
      logger.detailed('List-hooks mode selected. Continuing...');
      // listHooks();
      break;
    case 'list_scripts':
      logger.detailed('List-scripts mode selected. Continuing...');
      // listScripts();
      break;
    default:
      logger.error(
        'An unknown error has occurred. Exiting...',
        new Error('Unknown error'),
      );
      break;
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
  > deno cache --no-check=remote --reload https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts
  > deno install --no-check=remote --allow-run=deno,git --allow-write=./.git-hooks/ --allow-read=./.git-hooks/,./.git/ -f -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts 

USAGE:
  git-hooked [command] [options]

COMMANDS
  install                        Install the git-hooked environment. This is selected by default.
  uninstall                      Remove the git-hooked environment and the associated git configuration changes. This will not remove individual scripts.
  upgrade                        Upgrade the git-hooked cli from the remote repository. This will install the latest main branch release.

OPTIONS:
  -h, --help                     Show this help message.
  -c, --config [file]            Specify the Deno configuration file to use. Defaults to 'deno.json' and 'deno.jsonc' respectively.
  --dry-run                      Print the commands that would be executed that make changes, but don't execute them. Certain commands are executed for parsing.
  -l, --list-hooks               List all supported git-hooks.
  -s, --list-scripts             List all local scripts that are mapped to a supported git-hook.
  -v, --verbose                  Print additional output of the steps taken by the script. Quiet takes precedence.
  -q, --quiet                    Disregard all non-error output. This takes precedence over verbose.

EXIT CODES:
  0                              Successfully executed based on the provided arguments.
  4                              One or more arguments were invalid or incompatible.
  16                             Exited due to being unable to locate or execute the 'git' command.
  17                             Exited due to not being able to determine if the current directory is the top-level of a git repository.
  128                            Exited due to insufficient Deno run permissions during startup permission resolution. Potentially declined a prompt?
  129                            Exited due to insufficient Deno run permissions during runtime permission resolution. Potentially revoked permission?
  If no options are specified, the default behavior is to propogate to all supported git-hooks. This script will always override any existing git-hooks.
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
