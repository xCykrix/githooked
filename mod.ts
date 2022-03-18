import { Args } from 'https://deno.land/std@0.128.0/flags/mod.ts';
import { grant, parse } from './deps.ts';
import { initHooks } from './src/init.ts';
import { validate } from './src/util/args.ts';
import { Logger } from './src/util/logger.ts';
import { deno } from './src/util/run.ts';

// Define the constants of the tool.
const version = '0.0.4';

// Define the initial state of the cli logger util.
export const logger: Logger = new Logger();

/**
 * The main logic of the tool. This is where the magic happens.
 */
async function main(): Promise<void> {
  // Build the permission state for the tool.
  logger.detailed(
    'If prompted, please allow the following permissions. They are required for this tool to function.',
  );
  logger.detailed('Permission requests are now being resolved...');
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

  // Convert and validate the Deno.args to a more workable format. Wraps in a try/catch to gracefully handle the error.
  let args: Args | null = null;
  try {
    args = parse(Deno.args, {
      unknown: (arg, key) => validate(options(false), arg, key),
    });
  } catch (err: unknown) {
    logger.error(
      'Failed to validate one or more provided flag(s) to the tool.',
    );
    logger.error(
      'Please review the below error and use the "--help" or "--version" flag for more information and help.',
      err as Error,
    );
    Deno.exit(1);
  }

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

function commands(): string[] {
  const commands = [
    {
      base: 'install',
      usage: '',
      description:
        `Install the githooked environment. Creates the '.git-hooked' folder and updates the localized scripts.`,
    },
    {
      base: 'upgrade',
      usage: '',
      description:
        'Upgrade the githooked cli from deno.land. This will install the latest versioned release. We recommend running install after an upgrade.',
    },
    {
      base: 'uninstall',
      usage: '',
      description:
        `Remove the githooked environment and the associated git configuration changes. This will not remove individual scripts or the '.git-hooked' folder.`,
    },
  ];

  const result: string[] = [];
  for (const command of commands) {
    result.push(
      [
        `  ${command.base} ${command.usage}`.padEnd(32, ' '),
        command.description,
      ].join(''),
    );
  }
  return result;
}

function options(unified: boolean): string[] {
  const options = [
    { base: 'help', alias: ['h'], description: 'Show this help message.' },
    {
      base: 'quiet',
      alias: ['q'],
      description:
        'Disregard all non-error output. Takes precedence over "--verbose" if provided.',
    },
    {
      base: 'verbose',
      alias: ['v'],
      description:
        'Print additional output of the steps or actions taken by the tool.',
    },
    {
      base: 'dry-run',
      alias: ['d'],
      description:
        'Describe the actions that would normally be taken, without making actual changes.',
    },
    {
      base: 'version',
      alias: [],
      description:
        'Show the version, license, copyright, and acknowledgment message.',
    },
  ];

  // Build the full string for the usage description.
  const result: string[] = [];
  if (unified) {
    for (const option of options) {
      const aliases: string[] = [];
      for (const alias of option.alias) {
        aliases.push(`-${alias}`);
      }
      result.push(
        [
          `  ${aliases.join(' ')} ${!(aliases.length > 0) ? '  ' : ''}${
            !option.base.startsWith('--') ? '--' : ''
          }${option.base}`.padEnd(
            32,
            ' ',
          ),
          option.description,
        ].join(''),
      );
    }
    return result;
  }

  // Parse out the flag values that allow argument parsing.
  for (const option of options) {
    result.push(option.base);
    result.push(...option.alias);
  }
  return result;
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
${commands().join('\n')}

OPTIONS:
${options(true).join('\n')}

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
