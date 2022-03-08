import { parse } from './deps.ts';
import { detect, InstallCommand, validate } from './src/util/args.ts';
import { Logger } from './src/util/logger.ts';

// Define the constants of the application.
const version = '1.0.0';

// Define the state of the application.
export const logger: Logger = new Logger();

/** The allowed flags and their aliases. This is used by the {@link validate} function. */
const allowedArgs = [
  // Cli Arguments
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
  'version'
]

/**
 * The main logic of the script. This is where the magic happens.
 */
function main(): void {
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
  const mode = detect((args._.shift() ?? 'install') as InstallCommand, args);
  logger.detailed(`Found selection mode as -> ${mode}`);

  // Handle the different modes.
  switch (mode) {
    case 'full_install':
    case 'dry_install':
      logger.detailed('Install mode selected. Continuing...');
      // initHooks(mode);
      break;
    case 'run_script': {
      logger.detailed('Run script mode selected. Continuing...');
      const script = args._.shift() as string;
      logger.detailed(`Found script to run as -> ${script}`);
      // runScript(args._[1]);
      break;
    }
    case 'list_hooks_and_scripts':
      logger.detailed('List-hooks and list-scripts mode selected. Continuing...');
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
      logger.error('An unknown error has occurred. Exiting...', new Error('Unknown error'));
      break;
  }
}

/**
 * Show the usage banner.
 */
function usageBanner() {
  logger.always(`
Deno Git-Hooks Runner
  Register and configure the git-hooks for arbitrary commands and user scripting. Useful for automation of lint, fmt, tests, and enforcing standards.

INSTALL:
  > deno install --allow-run=git --allow-write=./.git/ --allow-read=./.git-hooks/ -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts
  > deno install --allow-run --allow-write --allow-read -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts
USAGE:
  git-hooked [command] [options]

COMMANDS
  install                        Install the git-hooked environment. This is selected by default.
  run [script] [args]            Run the associated script name from the configuration. Useful for testing.

OPTIONS:
  -h, --help                     Show this help message.
  -c, --config [file]            Specify the Deno configuration file to use. Defaults to 'deno.json' and 'deno.jsonc' respectively.
  --dry-run                      Print the commands that would be executed, but don't execute them.
  -l, --list-hooks               List all supported git-hooks.
  -s, --list-scripts             List all local scripts that are mapped to a supported git-hook.
  -v, --verbose                  Print additional output of the steps taken by the script. Quiet takes precedence.
  -q, --quiet                    Disregard all non-error output. This takes precedence over verbose.

  If no options are specified, the default behavior is to propogate to all supported git-hooks. This script will always override any existing git-hooks.
`);
}

function versionBanner() {
  logger.always(`
Deno Git-Hooks Runner - git-hooked - Version v${version}.

Available under the MIT License. Copyright 2022 for Amethyst Studio on behalf of Samuel J Voeller (xCykrix).
https://opensource.org/licenses/MIT

The source code is available at: https://github.com/amethyst-studio/git-hooked
Versioned with: https://deno.land/x/git-hooked

Inspired by Husky for Node.js: https://github.com/typicode/husky
`)
}

/**
 * The entry point of the script when called directly from cli.
 */
if (import.meta.main) {
  main();
}
