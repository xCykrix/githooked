import { exists } from "./util/exists.ts";
import { GitHooks } from "./util/git.ts";

const base = 
`#!/usr/bin/env sh

# Import the git-hooked wrapper to prepare the env and execute the script below.
. "$(dirname "$0")/_util/git-hooked.sh"

# Your script begins here.
# The last command to run, or explicit "exit" commands, will determine the status code to Git.

{{COMMAND}}

`

export async function generate(hook: GitHooks): Promise<void> {
  if (!await exists(`./.git-hooks/${hook}`)) {
    const content = base.replace('{{COMMAND}}', `echo "Placeholder git-hook for ${hook}."\n\nexit 0`);
    await Deno.writeFile(
      `./.git-hooks/${hook}`,
      new TextEncoder().encode(content)
    );
  }
}