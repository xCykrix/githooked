import { checkLogLevel, LogWeight } from '../mod.ts';
import { git } from './execute/git.ts';
import { exists } from './util/exists.ts';

export async function uninstall(
  { logLevel }: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  },
): Promise<void> {
  // Post the start of install.
  console.info(
    'Removing githooked from the current workspace...',
  );

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

  // Set the core.hooksPath to use our hooks.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Setting core.hooksPath to default value...',
    );
  }
  await git(['config', '--unset', 'core.hooksPath']);

  console.info();
  console.info(
    'Done! Githooked has been remove from the current workspace. Hooks from githooked will no longer execute with git actions.',
  );
}
