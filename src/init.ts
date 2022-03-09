import { dirname, fromFileUrl, resolve } from "../deps.ts";
import { logger } from '../mod.ts';
import { generate } from "./generate.ts";
import { InstallMode } from './util/args.ts';
import { exists } from './util/exists.ts';
import { git, GitHooks } from './util/git.ts';

const __dirname = dirname(fromFileUrl(import.meta.url));

export async function initHooks(mode: InstallMode): Promise<boolean> {
  // Ensure that we are in a git repository.
  // If the git command is not found, the application will exit.
  await git(['rev-parse']);

  // Ensure that cwd is git top level.
  if (!await exists('./.git/')) {
    logger.error(
      `The current directory is not a git repository. Please ensure that you are in the top level of a git repository. Code: 17`,
    );
    Deno.exit(17);
  }

  // Create the needed directories if they do not exists.
  if (!await exists('./.git-hooks/')) {
    await Deno.mkdir('./.git-hooks/_util/', { recursive: true });
  }

  // Bind the files and scripts needed to execute git-hooked.
  await Deno.writeFile(
    './.git-hooks/_util/.gitignore',
    new TextEncoder().encode('*\n')
  );
  await Deno.copyFile(resolve(__dirname, './git-hooked.sh'), './.git-hooks/_util/git-hooked.sh');

  // Define the list of popular hooks.
  const hooks: GitHooks[] = [
    'pre-commit',
    'prepare-commit-msg',
    'pre-push'
  ];

  for (const hook of hooks) {
    await generate(hook);
  }

  // Set the core.hooksPath to leverage ./.git-hooks/
  await git(['config', 'core.hooksPath', './.git-hooks/']);

  return true;
}
