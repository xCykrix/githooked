import { checkLogLevel, LogWeight } from '../mod.ts';
import { deno } from './execute/deno.ts';

/** The upgrade function. Hooked with cliffy. */
export async function upgrade(
  { logLevel }: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  },
): Promise<void> {
  // Post the start of install.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Upgrading the global installation of githooked...',
    );
  }

  // Update the cached version.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Running: deno cache --reload --no-check=remote https://deno.land/x/githooked/mod.ts',
    );
  }
  await deno([
    'cache',
    '--reload',
    '--no-check',
    'https://deno.land/x/githooked/mod.ts',
  ]);

  // Upgrade the installed version of githooked.
  if (checkLogLevel(LogWeight[logLevel], LogWeight.info)) {
    console.info(
      'Running: deno install -f --no-check=remote [...] https://deno.land/x/githooked/mod.ts',
    );
  }
  await deno([
    'install',
    '-f',
    '--no-check',
    '--allow-run=deno,git',
    '--allow-read=.git,.git-hooks',
    '--allow-write=.git-hooks',
    'https://deno.land/x/githooked/mod.ts',
  ]);

  // Print the final messages.
  console.info();
  console.info(
    'Done! Githooked has been upgraded to the latest public release version.',
  );
}
