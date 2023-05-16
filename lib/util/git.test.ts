import { assertEquals } from '../../deps.ts';
import { getHooks, git } from './git.ts';

Deno.test('git.ts', async (t) => {
  await t.step('command rev-parse', async () => {
    assertEquals((await git(`${Deno.cwd()}`, ['rev-parse'])).status, 0);
  });

  await t.step('error', async () => {
    assertEquals((await git(`${Deno.cwd()}`, ['invalid-command'])).status, 1);
  });

  await t.step('getHooks', () => {
    assertEquals(getHooks().includes('pre-commit'), true);
  });
});
