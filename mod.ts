import { LoggerLevel } from 'https://raw.githubusercontent.com/amethyst-studio/amethyst-std/3b6e91653a654493573fd2eae5279e5013f0728a/lib/logger/interfaces.ts';
import { CLI, LoggerManager, MainCommand, Subcommand } from './deps.ts';
import { Install } from './lib/install.ts';

/** githooked */
class Main extends MainCommand {
  public override signature = 'githooked';

  public override subcommands = [
    InstallCommand,
  ];
}

/** githooked install */
class InstallCommand extends Subcommand {
  public override signature = 'install';

  public override options = {
    '-d, --debug': 'Provide additional output useful for troubleshooting.',
  };

  /** Call Githooked Installer. */
  public override async handle(): Promise<void> {
    LoggerManager.configure({
      definition: {
        'install': {
          level: this.option('--debug') === true ? LoggerLevel.Trace : LoggerLevel.Information,
          location: false,
        },
      },
    });
    LoggerManager.getLogger('install').info({
      content: 'Installing githooked...',
    });

    /** Process the Installation. */
    await Install.update(Deno.cwd());
  }
}

// Build the application base.
const cli = new CLI({
  name: 'githooked',
  description: 'Manage git-hooks across your team with cross-platform support and mobility. Comfortably integrates with git to allow custom scripting.',
  version: 'v1.0.0',
  command: Main,
});

// Run the application.
await cli.run();
