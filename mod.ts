import { CLI, MainCommand, Subcommand } from './deps.ts';
import { Install } from './lib/install.ts';

class Main extends MainCommand {
  public override signature = 'githooked';

  public override subcommands = [
    InstallCommand,
  ];
}

class InstallCommand extends Subcommand {
  public override signature = 'install';

  public override options = {
    '--debug, -d':
      'Provide additional output useful for troubleshooting.',
  };

  /** Call Githooked Installer. */
  public override async handle(): Promise<void> {
    /** Process the Installation. */
    await Install.update(!!this.option('debug'));
  }
}

const cli = new CLI({
  name: 'githooked',
  description:
    'Manage git-hooks across your team with cross-platform support and mobility. Comfortably integrates with git to allow custom scripting.',
  version: 'v1.0.0',
  command: Main,
});
await cli.run();
