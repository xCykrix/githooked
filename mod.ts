import { Command, EnumType } from './deps.ts';
import { install } from './src/install.ts';
import { uninstall } from './src/uninstall.ts';
import { upgrade } from './src/upgrade.ts';

/** The LogWeight Enum */
export enum LogWeight {
  'debug' = 0,
  'info' = 1,
  'warn' = 2,
  'error' = 3,
}

/**
 * Check if the expected LogWeight is greater than or equal to the
 *
 * @param provided - The LogWeight from Cliffy.
 * @param expected - The LogWeight expected to print the message.
 *
 * @returns A boolean based on if the message is allowed to be logged with the current options.
 */
export function checkLogLevel(
  provided: LogWeight,
  expected: LogWeight = LogWeight.info,
): boolean {
  if (expected >= provided) {
    return true;
  } else {
    return false;
  }
}

// Initialize the application. This is where the magic happens.
await new Command()
  .name('githooked')
  .version('0.0.6')
  .description(
    'Git hooks for the Deno lifecycle. Inspired by Typicode\'s Husky.',
  )
  // Add the type validation.
  .type(
    'log-level',
    new EnumType(['debug', 'info', 'warn', 'error']),
    { global: true },
  )
  // Add the options.
  .option(
    '-l --log-level <level:log-level>',
    'Set the logging level.',
    {
      default: 'info',
      global: true,
    },
  )
  .action((options) => {
    install(options);
  })
  // Add the commands.
  .command(
    'enable',
    new Command()
      .alias('install')
      .description(
        'Enable githooked in the currently selected workspace.',
      )
      .action((options) => {
        install(options);
      }),
  )
  .command(
    'upgrade',
    new Command()
      .description(
        'Upgrade the currently installed version of githooked.',
      )
      .action((options) => {
        upgrade(options);
      }),
  )
  .command(
    'disable',
    new Command()
      .description(
        'Disable githooked in the currently selected workspace.',
      )
      .action((options) => {
        uninstall(options);
      }),
  )
  .parse(Deno.args);
