import { assertEquals } from '../../deps.ts';
import { exists } from './fs.ts';

/**
 * ID: FS_API,
 * Description: Test to validate the API of file system access.
 * Scope: lib/util/fs.ts
 */

Deno.test('FS Api', async (t) => {
  await t.step('validate', async () => {
    assertEquals(await exists(`${Deno.cwd()}/lib`), true);
  });

  await t.step('error', async () => {
    assertEquals(await exists(`${Deno.cwd()}/fakePath`), false);
  });
});
