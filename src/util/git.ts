import { logger } from '../../mod.ts';
import { hasPermission } from '../../permission.ts';

/**
 * Execute a git command and wait for the status and output.
 *
 * @remarks
 *
 * This function will abort the application if run permissions for 'git' are not available.
 * This function will abort the application if 'git' is not available in path.
 *
 * @param command The command to execute as an array. Do not specify 'git' as the first element.
 * @returns The status and output of the command.
 */
export async function git(command: string[]): Promise<GitResult> {
  // Ensure that we have permission to execute the git command.
  if (!hasPermission('run.git')) {
    logger.error(
      `The 'run.git' permission is required to execute git commands.`,
    );
    logger.error(
      'Please run the application again with --allow-run=git to resolve this error.',
    );
    Deno.exit(128);
  }

  // Ensure the leading `git` is added to the command.
  if (command[0] !== 'git') {
    command.unshift('git');
  }

  // Execute the command and collect results. Exit the application on failure to locate git.
  try {
    const proc = Deno.run({
      cmd: command,
      stdout: 'piped',
      stderr: 'piped',
    });
    const status = await proc.status();
    const stdout = new TextDecoder().decode(await proc.output());
    const stderr = new TextDecoder().decode(await proc.stderrOutput());

    // Send the response to the caller.
    return {
      proc,
      status,
      stdout,
      stderr,
    };
  } catch (err: unknown) {
    logger.error(
      `The git command failed to execute or was not available. Please resolve this issue and attempt to run the command again. Command: '${
        command.join(' ')
      }'`,
      err as Error,
    );
    Deno.exit(16);
  }
}

// Interface definitions.
export interface GitResult {
  proc: Deno.Process<{
    cmd: string[];
    stdout: 'piped';
    stderr: 'piped';
  }>;
  status: Deno.ProcessStatus;
  stdout: string;
  stderr: string;
}

// Type defin
export type GitHooks =
  | 'applypatch-msg'
  | 'pre-applypatch'
  | 'post-applypatch'
  | 'pre-commit'
  | 'pre-merge-commit'
  | 'prepare-commit-msg'
  | 'commit-msg'
  | 'post-commit'
  | 'pre-rebase'
  | 'post-checkout'
  | 'post-merge'
  | 'pre-push'
  | 'pre-receive'
  | 'update'
  | 'proc-receive'
  | 'post-receive'
  | 'post-update'
  | 'reference-transaction'
  | 'push-to-checkout'
  | 'pre-auto-gc'
  | 'post-rewrite'
  | 'sendemail-validate'
  | 'fsmonitor-watchman'
  | 'p4-changelist'
  | 'p4-prepare-changelist'
  | 'p4-post-changelist'
  | 'p4-pre-submit'
  | 'post-index-change';
