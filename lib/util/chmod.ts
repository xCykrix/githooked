/**
 * Execute a git command and wait for the status and output.
 *
 * @param command = The command to execute as an array. Do not specify 'git' as the first element.
 *
 * @returns The status and output of the command.
 */
export async function chmod(
  cwd: string,
  command: string[],
): Promise<{
  proc: Deno.Command;
  status: number;
  stdout: string;
  stderr: string;
}> {
  // Execute the command and collect results. Exit the application on failure to locate git.
  const proc = new Deno.Command('chmod', {
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
