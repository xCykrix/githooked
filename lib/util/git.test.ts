import { assertEquals } from '../../deps.ts';
import { getHooks, git } from './git.ts';

/**
 * ID: GIT_API.
 * Description: Validate the code used to execute git actions.
 * Scope: lib/util/git.ts
 */

Deno.test('Git API', async (t) => {
  await t.step('command rev-parse', async () => {
    await git(`${Deno.cwd()}`, ['rev-parse']);
  });

  await t.step('getHooks', () => {
    assertEquals(getHooks().includes('pre-commit'), true);
  });
});
