import { assertEquals } from './deps.ts';
import { Install } from './lib/install.ts';
import { git } from './lib/util/git.ts';

/**
 * ID: GENERAL_API.
 * Description: Test to validate the API the main application code.
 * Scope: mod.ts lib/install.ts
 */
Deno.test('General API', async (t) => {
  await t.step('prepare', async () => {
    await Deno.mkdir('./_TEST_SUITE/', {
      recursive: true,
    });
    await git(`${Deno.cwd()}/_TEST_SUITE`, ['init']);
    await git(`${Deno.cwd()}/_TEST_SUITE`, ['add', '*']);
    await git(`${Deno.cwd()}/_TEST_SUITE`, [
      'commit',
      '-m',
      '"Test Commit"',
    ]);
  });

  await t.step('validate', async () => {
    assertEquals(
      await Install.update(`${Deno.cwd()}/_TEST_SUITE`).then(() => {
        return true;
      }).catch(() => {
        return false;
      }),
      true,
    );
  });

  await t.step('error', async () => {
    assertEquals(
      await Install.update(`NOT_A_PATH`).catch(() => {
        return false;
      }),
      false,
    );
  });

  await t.step('finish', async () => {
    await Deno.remove(`${Deno.cwd()}/_TEST_SUITE`, {
      recursive: true,
    });
  });
});