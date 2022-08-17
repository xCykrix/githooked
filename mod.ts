import { CLI, MainCommand, Subcommand } from './deps.ts';
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
    console.info('Installing');

    /** Process the Installation. */
    await Install.update(Deno.cwd(), !!this.option('--debug'));
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
