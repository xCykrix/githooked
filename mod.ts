import { CLI, MainCommand } from './deps.ts';

class Main extends MainCommand {
}

const cli = new CLI({
  name: 'githooked',
  description:
    'Manage git-hooks across your team with cross-platform support and mobility. Comfortably integrates with git to allow custom scripting.',
  version: 'v1.0.0',
  command: Main,
});
await cli.run();
