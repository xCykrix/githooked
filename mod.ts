import { Command, EnumType } from './deps.ts';
import { install } from './src/install.ts';
import { uninstall } from './src/uninstall.ts';
import { upgrade } from './src/upgrade.ts';

export enum LogWeight {
  'debug' = 0,
  'info' = 1,
  'warn' = 2,
  'error' = 3,
}

export function checkLogLevel(
  provided: LogWeight,
  expected: LogWeight,
): boolean {
  if (expected >= provided) {
    return true;
  } else {
    return false;
  }
}

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
