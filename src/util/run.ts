import { logger } from '../../mod.ts';

/**
 * Execute a deno command and wait for the status and output.
 *
 * @param command The command to execute as an array. Do not specify 'deno' as the first element.
 *
 * @returns The status and output of the command.
 */
export async function deno(command: string[]): Promise<CLIResult> {
  if (command[0] !== 'deno') {
    command.unshift('deno');
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
      `The deno command failed to execute or was not available. Please resolve this issue and attempt to run the command again. Command: '${
        command.join(' ')
      }'`,
      err as Error,
    );
    Deno.exit(1);
  }
}

/**
 * Execute a git command and wait for the status and output.
 *
 * @param command The command to execute as an array. Do not specify 'git' as the first element.
 *
 * @returns The status and output of the command.
 */
export async function git(command: string[]): Promise<CLIResult> {
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
    Deno.exit(1);
  }
}

// Define the Interfaces and Types.

/** CLIResult */
export interface CLIResult {
  proc: Deno.Process<{
    cmd: string[];
    stdout: 'piped';
    stderr: 'piped';
  }>;
  status: Deno.ProcessStatus;
  stdout: string;
  stderr: string;
}

/** GitHooks */
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
