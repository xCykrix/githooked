/**
 * Execute a git command and wait for the status and output.
 *
 * @param command = The command to execute as an array. Do not specify 'git' as the first element.
 *
 * @returns The status and output of the command.
 */
export async function git(
  cwd: string,
  command: string[],
): Promise<{
  proc: Deno.Command;
  status: number;
  stdout: string;
  stderr: string;
}> {
  // Execute the command and collect results. Exit the application on failure to locate git.
  const proc = new Deno.Command('git', {
    args: command,
    cwd,
  });
  const { code: status, stdout, stderr } = await proc.output();
  const stdoutString = new TextDecoder()
    .decode(
      stdout,
    );
  const stderrString = new TextDecoder()
    .decode(
      stderr,
    );

  // Send the response to the caller.
  return {
    proc,
    status,
    stdout: stdoutString,
    stderr: stderrString,
  };
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

/** Literal Types */
export function getHooks(): GitHooks[] {
  return [
    'applypatch-msg',
    'pre-applypatch',
    'post-applypatch',
    'pre-commit',
    'pre-merge-commit',
    'prepare-commit-msg',
    'commit-msg',
    'post-commit',
    'pre-rebase',
    'post-checkout',
    'post-merge',
    'pre-push',
    'pre-receive',
    'update',
    'proc-receive',
    'post-receive',
    'post-update',
    'reference-transaction',
    'push-to-checkout',
    'pre-auto-gc',
    'post-rewrite',
    'sendemail-validate',
    'fsmonitor-watchman',
    'p4-changelist',
    'p4-prepare-changelist',
    'p4-post-changelist',
    'p4-pre-submit',
    'post-index-change',
  ];
}
