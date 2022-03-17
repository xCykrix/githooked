import { grant, parse } from './deps.ts';
import { initHooks } from './src/init.ts';
import { validate } from './src/util/args.ts';
import { Logger } from './src/util/logger.ts';
import { deno } from './src/util/run.ts';

// Define the constants of the tool.
const version = '0.0.3';

// Define the state of the cli logger util.
export const logger: Logger = new Logger();

/** The const of permitted cli flag values. This is used with the {@link validate} function to control the processing state of GitHooked. */
const allowed = [
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
 * The main logic of the tool. This is where the magic happens.
 */
async function main(): Promise<void> {
  // Build the permission state for the tool.
  logger.detailed(
    'If prompted, please allow the following permissions. They are required for this tool to function.',
  );
  logger.detailed('Permission requests are now being resoleved...');
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
  logger.detailed(
    'Permission requests have been resolved. The tool is available for execution.',
  );

  // Convert and validate the Deno.args to a more workable format.
  const args = parse(Deno.args, {
    unknown: (arg: string, key: string | undefined) =>
      validate(allowed, arg, key),
  });

  // Set the logging mode from the arguments.
  if (args.verbose || args.v) logger.setState(true, true);
  if (args.quiet || args.q) logger.setState(false, false);

  // If the user wants to see the help or version message, print it and exit.
  if (args.help || args.h || args.version) {
    if (args.version) versionBanner();
    else usageBanner();
    Deno.exit(0);
  }

  // Print the small header.
  logger.basic(
    `githooked: v${version} - Git hooks for the Deno lifecycle. Inspired by Typicode's Husky.`,
  );
  logger.basic();

  // Handle the command specified.
  const command = args._.shift() ?? 'install';
  switch (command) {
    case 'install': {
      logger.basic('Installing githooked to the current workspace ...');
      await initHooks(args['dry-run'] ? false : true);
      break;
    }
    case 'upgrade': {
      logger.basic(
        'Upgrading githooked installation via deno cli from deno.land ...',
      );
      logger.detailed(
        'Running: deno install -f --no-check=remote [...] https://deno.land/x/githooked/mod.ts',
      );
      if (!args['dry-run']) {
        await deno([
          'install',
          '-f',
          '--no-check=remote',
          '--allow-run=deno,git',
          '--allow-read=.git,.git-hooks',
          '--allow-write=.git-hooks',
          'https://deno.land/x/githooked/mod.ts',
        ]);
      }
      break;
    }
    case 'uninstall': {
      logger.basic('Uninstalling githooked from the current workspace ...');
      /** TODO: Uninstallation of tooling. Relatively simple, just not yet available. */
      // await deinitHooks(args['dry-run'] ? false : true);
      break;
    }
    default: {
      throw new Error(
        `Unrecognized command: ${command}. Please specify one of the following: install, upgrade, uninstall.`,
      );
    }
  }
}

/**
 * Show the command usage banner.
 */
function usageBanner() {
  logger.always(`
Deno 'githooked' - Install and manage Git hooks for the Deno lifecycle.
  Useful for automation of lint, fmt, tests, and enforcing development standards.

INSTALL:
  > deno install -f --no-check=remote --allow-run=deno,git --allow-read=.git,.git-hooks --allow-write=.git-hooks https://deno.land/x/githooked/mod.ts

UPGRADE:
  > githooked upgrade

USAGE:
  githooked [command] [options]

COMMANDS
  install                        Install the githooked environment. Creates the '.git-hooked' folder and updates the localized scripts.
  upgrade                        Upgrade the githooked cli from deno.land. This will install the latest versioned release. We recommend running install after an upgrade.
  uninstall                      Remove the githooked environment and the associated git configuration changes. This will not remove individual scripts or the '.git-hooked' folder.

OPTIONS:
  -h, --help                     Show this help message.
  -q, --quiet                    Disregard all non-error output. This takes precedence over verbose.
  -v, --verbose                  Print additional output of the steps taken by the script. Quiet takes precedence.
  --dry-run                      Print the commands that would be executed that make changes, but don't execute them. Certain commands are executed for validation purposes.
  --version                      Show the version, license, copyright, and acknowledgments information.

If no options are specified, the default behavior is to install the git-hooks handler. 
This script will never override any existing git-hooks, but hooks not created under '.git-hooked' will no longer be executed.
`);
}

/**
 * Show the version and information banner.
 */
function versionBanner() {
  logger.always(`
Deno Git-Hooks Helper - githooked - Version v${version}.

Available under the MIT License. Copyright 2022 for Amethyst Studio on behalf of Samuel J Voeller (xCykrix).
https://opensource.org/licenses/MIT

The source code is available at: https://github.com/amethyst-studio/githooked
Versioned with: https://deno.land/x/githooked

Inspired by and a loose port of Husky for Node.js: https://github.com/typicode/husky
`);
}

/**
 * The entry point of the script when called directly from cli.
 */
if (import.meta.main) {
  main();
}
