import { logger } from '../mod.ts';
import { generate } from './generate.ts';
import { exists } from './util/exists.ts';
import { git, GitHooks } from './util/run.ts';

const shim = `#!/usr/bin/env bash

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

  bash -e "$0" "$@"
  code="$?"

  if [ "$code" != "0" ]; then
    notice "The hook '$hook_name' exited with code '$code' (error)."
    notice "Please review the output above to resolve the error. After that, try the git operation again."
  fi
  
  exit "$code"
fi
`;

export async function initHooks(allowChanges: boolean): Promise<void> {
  // Ensure that we are in a git repository.
  // If the git command is not found, the application also will exit.
  await git(['rev-parse']);

  // Ensure that cwd is git top level.
  if (!await exists('./.git/')) {
    logger.error(
      `The current directory is not a git repository. Please ensure that you are in the top level of a git repository.`,
    );
    Deno.exit(1);
  }

  // Detect if upgrading or first installation.
  let upgrade = true;
  if (!await exists('./.git-hooks/')) {
    upgrade = false;
  }

  // Create the needed directories if they do not exists.
  logger.detailed('Initializing ./.git-hooks/ folder if needed ...');
  if (allowChanges) {
    await Deno.mkdir('./.git-hooks/_util/', { recursive: true, mode: 0o755 })
      .catch(() => {});
  }

  // Bind the files and scripts needed to execute git-hooked.
  logger.detailed('Writing to ./.git-hooks/_util/.gitignore ...');
  if (allowChanges) {
    await Deno.writeFile(
      './.git-hooks/_util/.gitignore',
      new TextEncoder().encode('*'),
    );
  }
  logger.detailed('Writing to ./.git-hooks/_util/git-hooked.sh ...');
  if (allowChanges) {
    await Deno.writeFile(
      './.git-hooks/_util/git-hooked.sh',
      new TextEncoder().encode(shim),
    );
  }

  // Define the list of popular hooks.
  const hooks: GitHooks[] = [
    'prepare-commit-msg',
    'pre-commit',
    'pre-push',
  ];

  // Generate the hooks that are used frequently for a first install.
  if (!upgrade) {
    for (const hook of hooks) {
      logger.basic(`Generating Example Hook: ./.git-hooks/${hook} ...`);
      if (allowChanges) await generate(hook);
    }
  }

  // Apply the correct permissions to the existing hooks.
  const folders = await Deno.readDir('./.git-hooks/');
  for await (const file of folders) {
    if (file.isFile && !file.name.includes('.')) {
      logger.detailed(`Setting chmod '0o755' to ./.git-hooks/${file.name} ...`);
      if (allowChanges) await Deno.chmod(`./.git-hooks/${file.name}`, 0o755);
    }
  }

  // Set the core.hooksPath to leverage ./.git-hooks/
  logger.detailed('Setting core.hooksPath to use ./.git-hooks/ ...');
  if (allowChanges) await git(['config', 'core.hooksPath', './.git-hooks/']);
}
