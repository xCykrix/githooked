import { logger } from "../../mod.ts";

const useGit = { name: 'run', path: 'git' } as const;
let gitState: Deno.PermissionStatus | null = null;

export async function requestGitPermission(): Promise<void> {
  gitState = await Deno.permissions.request(useGit);
  
  if (gitState.state === 'denied') {
    logger.error('Permission to use git was not granted. This is required for the application to function.');
    Deno.exit(1);
  }
}

export async function git(command: string[]): Promise<void> {
  if (command[0] !== 'git') {
    command.unshift('git');
  }

  const proc = Deno.run({
    clearEnv: true,
    cmd: command
  });
  const status = await proc.status();

  console.info(proc, status)
}