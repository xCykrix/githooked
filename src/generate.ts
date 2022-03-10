import { exists } from './util/exists.ts';
import { GitHooks } from './util/run.ts';

const base = `#!/usr/bin/env sh

# Configure the hook with these options.
HOOK_DEBUG=0          # Set to 1 to enable debug mode. This will print additional output.
HOOK_DISABLE_NOTICE=0 # Set to 1 to disable the notice when the hook exits with an error code.

# Import the git-hooked wrapper to prepare the env and execute the script below.
. "$(dirname "$0")/_util/git-hooked.sh"

# Your script begins here.
# The last command to run, or explicit "exit" commands, will determine the status code to Git.

{{COMMAND}}

`;

/**
 * Generates the template hook from above with a placeholder echo command as an example.
 * 
 * @param hook The name of the hook to generate.
 */
export async function generate(hook: GitHooks): Promise<void> {
  if (!await exists(`./.git-hooks/${hook}`)) {
    const content = base.replace(
      '{{COMMAND}}',
      `echo "Placeholder git-hook for ${hook}."\n\nexit 0`,
    );
    await Deno.writeFile(
      `./.git-hooks/${hook}`,
      new TextEncoder().encode(content),
    );
  }
}
