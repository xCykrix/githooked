import { Command, EnumType } from './deps.ts';
import { install } from './src/install.ts';
import { uninstall } from './src/uninstall.ts';
import { upgrade } from './src/upgrade.ts';

await new Command()
  .name('githooked')
  .version('0.0.5')
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
  .option('-d --debug', 'Enable debugging output.', {
    global: true,
  })
  .option(
    '-l --log-level <level:log-level>',
    'Set the logging level.',
    {
      default: 'info',
      global: true,
    },
  )
  // Add the commands.
  .command(
    'enable',
    new Command()
      .alias('install')
      .description(
        'Install githooked to the currently selected workspace.',
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

// import { CommandLineInterface } from './commandInterface.ts';
// import { grant } from './deps.ts';
// import { install } from './src/install.ts';

// // Define the constants of the tool.
// const title = 'githooked';
// const description =
//   'Git hooks for the Deno lifecycle. Inspired by Typicode\'s Husky.';
// const version = '0.0.5';

// // Resolve the Deno Permissions.
// await grant({
//   id: 'run.deno',
//   descriptor: {
//     name: 'run',
//     command: 'deno',
//   },
//   options: {
//     prompt: true,
//     require: true,
//   },
// });
// await grant({
//   id: 'run.git',
//   descriptor: {
//     name: 'run',
//     command: 'git',
//   },
//   options: {
//     prompt: true,
//     require: true,
//   },
// });
// await grant({
//   id: 'read.git',
//   descriptor: {
//     name: 'read',
//     path: '.git',
//   },
//   options: {
//     prompt: true,
//     require: true,
//   },
// });
// await grant({
//   id: 'read.git-hooks',
//   descriptor: {
//     name: 'read',
//     path: '.git-hooks',
//   },
//   options: {
//     prompt: true,
//     require: true,
//   },
// });
// await grant({
//   id: 'write.git-hooks',
//   descriptor: {
//     name: 'write',
//     path: '.git-hooks',
//   },
//   options: {
//     prompt: true,
//     require: true,
//   },
// });

// // Initialize a new CommandLineInterface.
// const cli = new CommandLineInterface(
//   title,
//   description,
//   version,
//   {
//     install: [
//       'todo command(s)',
//     ],
//     upgrade: [
//       'todo command(s)',
//     ],
//     defaultCommand: 'install',
//     versionBanner: [
//       'Available under the MIT License. Copyright 2022 for Amethyst Studio on behalf of Samuel J Voeller (xCykrix).',
//       'https://opensource.org/licenses/MIT',
//       '',
//       'The source code is available at: https://github.com/amethyst-studio/githooked',
//       'Versioned with: https://deno.land/x/githooked',
//       '',
//       'Inspired by and a loose port of Husky for Node.js: https://github.com/typicode/husky',
//     ],
//   },
// );

// // Configure the CommandLineInterface commands and options via the API.
// await cli
//   .defaults()
//   // Commands
//   .addCommand(
//     'install',
//     ['init'],
//     'Install the githooked git-hooks to the current workspace.',
//     install,
//   )
//   .addCommand(
//     'uninstall',
//     ['uninit'],
//     'Disable the githooked git-hooks from the current workspace.',
//     install,
//   )
//   .addCommand(
//     'upgrade',
//     [],
//     'Upgrade the installed version of githooked to the latest release.',
//     install,
//   )
//   // Options
//   .addOption(
//     'dry-run',
//     ['d'],
//     'Describe changes without actually applying them.',
//   );

// // Run the application.
// await cli.run(
//   Deno.args,
// );
