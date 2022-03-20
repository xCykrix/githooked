import { deno } from './execute/deno.ts';

export async function upgrade(
  { debug }: { debug: boolean },
): Promise<void> {
  // Post the start of install.
  console.info(
    'Upgrading the global installation of githooked...',
  );

  if (debug) {
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

  if (debug) {
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
}
