import { logger } from '../mod.ts';
import { generate } from './generate.ts';
import { InstallMode } from './util/args.ts';
import { exists } from './util/exists.ts';
import { git, GitHooks } from './util/git.ts';

const shim = 
`#!/usr/bin/env sh

if [ -z "$SKIP_GIT_HOOKED_INIT" ]; then
  # Initialize the Debug Logger.
  debug () {
    if [ "$HOOK_DEBUG" = "1" ]; then
      echo "git-hooked (debug) - $1"
    fi
  }
  # Initialize the Notice Logger.
  notice () {
    if [ "$HOOK_DISABLE_NOTICE" = "0" ]; then
      echo "git-hooked (notice) - $1"
    fi
  }

  readonly hook_name="$(basename "$0")"
  debug "Calling '$hook_name' ..."

  if [ "$HOOK" = "0" ]; then
    debug "Skipping the hook due to the environment variable 'HOOK' being set to 0."
  fi

  readonly SKIP_GIT_HOOKED_INIT="1"
  export SKIP_GIT_HOOKED_INIT

  sh -e "$0" "$@"
  code="$?"

  if [ "$code" != "0" ]; then
    notice "The hook '$hook_name' exited with code '$code' (error)."
    notice "Please review the output above to resolve the error. After that, try the git operation again."
  fi
  
  exit "$code"
fi
`

export async function initHooks(mode: InstallMode): Promise<void> {
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
    logger.detailed('Creating ./.git-hooks/ folder ...');
    if (mode === 'full_install') {
      await Deno.mkdir('./.git-hooks/_util/', { recursive: true });
    }
  }

  // Bind the files and scripts needed to execute git-hooked.
  logger.detailed('Writing ./.git-hooks/_util/.gitignore ...');
  if (mode === 'full_install') {
    await Deno.writeFile(
      './.git-hooks/_util/.gitignore',
      new TextEncoder().encode('*'),
    );
  }
  logger.detailed('Writing ./.git-hooks/_util/git-hooked.sh ...');
  if (mode === 'full_install') {
    await Deno.writeFile(
      './.git-hooks/_util/git-hooked.sh',
      new TextEncoder().encode(shim)
    );
  }

  // Define the list of popular hooks.
  const hooks: GitHooks[] = [
    'pre-commit',
    'prepare-commit-msg',
    'pre-push',
  ];

  // Generate the hooks that are used frequently.
  for (const hook of hooks) {
    logger.detailed(`Touching ./.git-hooks/${hook} ...`);
    if (mode === 'full_install') {
      await generate(hook);
    }
  }

  // Set the core.hooksPath to leverage ./.git-hooks/
  logger.detailed('Setting core.hooksPath to use ./.git-hooks/ ...');
  if (mode === 'full_install') {
    await git(['config', 'core.hooksPath', './.git-hooks/']);
  }
}
