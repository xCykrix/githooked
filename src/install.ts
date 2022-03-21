import { checkLogLevel, LogWeight } from '../mod.ts';
import { git, GitHooks } from './execute/git.ts';
import { exists } from './util/exists.ts';

/** The const representation of the .git-hooks/_util/git-hooked.sh */
const init = `#!/usr/bin/env bash

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

  # Set and State the Hook
  readonly hook_name="$(basename "$0")"
  debug "Calling '$hook_name' ..."

  if [ "$HOOK" = "0" ]; then
    debug "Skipping the hook due to the environment variable 'HOOK' being set to 0."
  fi

  # Configure the hook to skip this call on the 
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

/** The const representation of a git hook as a template. */
const hook = `#!/usr/bin/env bash

# Configure the hook with these options.
HOOK_DEBUG=0          # Set to 1 to enable debug mode. This will print additional output.
HOOK_DISABLE_NOTICE=0 # Set to 1 to disable the notice when the hook exits with an error code.

# Import the git-hooked wrapper to prepare the env and execute the script below.
. "$(dirname "$0")/_util/git-hooked.sh"

# Your script begins here.
# The last command to run, or explicit "exit" commands, will determine the status code to Git.

{{COMMAND}}
`;

export async function install(
  { logLevel }: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  },
): Promise<void> {
  // Post the start of install.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Installing githooked in the current workspace...',
    );
  }

  // Validate the top-level git repository.
  if (!(await exists('./.git/'))) {
    console.error(
      'The current workspace is not a git repository. Please ensure you are in the top level repository.',
    );
    throw new Error('"./.git/" was not available.');
  }

  // Validate that the git repository is viable to install.
  await git(['rev-parse']).catch((err) => {
    console.error(
      'The current workspace did not respond to "git rev-parse" as expected. Please ensure the integrity of the current workspace.',
    );
    console.error(err);
    throw new Error(
      'The current git repository was found to not be safe for githooked to take actions.',
    );
  });

  // Detect first installation vs upgrade.
  let upgrade = true;
  if (!(await exists('./.git-hooks/'))) {
    if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
      console.info(
        'Detected as a first time install of githooked. "./.git-hooks/" was not available in the workspace.',
      );
    }
    upgrade = false;
  }

  // Create the needed folders if they are not available.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info('Preparing the folder structure...');
  }
  await Deno.mkdir('./.git-hooks/_util/', {
    recursive: true,
    mode: 0o755,
  }).catch(() => {});

  // Write the files and scripts if they are not available.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Initializing the "./.git-hooks/_util/" files...',
    );
  }
  await Deno.writeFile(
    './.git-hooks/_util/.gitignore',
    new TextEncoder().encode('*'),
  );
  await Deno.writeFile(
    './.git-hooks/_util/git-hooked.sh',
    new TextEncoder().encode(init),
  );

  // Initialize default hooks for the first time installation.
  if (!upgrade) {
    if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
      console.info(
        'Initializing the "./.git-hooks/" git-hook templates for first-time installation...',
      );
    }
    const hooks: GitHooks[] = [
      'prepare-commit-msg',
      'pre-commit',
      'pre-push',
    ];
    hooks.forEach(async (v) => {
      await Deno.writeFile(
        `./.git-hooks/${v}`,
        new TextEncoder().encode(
          hook.replace(
            '{{COMMAND}}',
            `echo "Placeholder git-hook for ${v}."\n\nexit 0`,
          ),
        ),
      );
    });
  }

  // Apply the correct permissions to the existing hooks.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Ensuring the correct permissions are set for the current hooks...',
    );
  }
  const hooks = await Deno.readDir('./.git-hooks/');
  for await (const hook of hooks) {
    if (hook.isFile && !hook.name.includes('.')) {
      if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
        console.info(
          `Running chmod '0o755' to "./.git-hooks/${hook.name}"...`,
        );
      }
      await Deno.chmod(`./.git-hooks/${hook.name}`, 0o755);
    }
  }

  // Set the core.hooksPath to use our hooks.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Setting core.hooksPath to use "./.git-hooks/"...',
    );
  }
  await git(['config', 'core.hooksPath', './.git-hooks/']);

  // Print the final messages.
  console.info();
  console.info(
    'Done! Githooked has been installed to the current workspace. Try running the command below to see the hooks in action!',
  );
  console.info(
    '> git add ./.git-hooked/ && git commit -m "build: add githooked to the workspace"',
  );
}
