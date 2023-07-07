import { assertEquals } from './deps.ts';
import { Install } from './lib/install.ts';
import { git } from './lib/util/git.ts';

Deno.test('api.mod.ts', async (t) => {
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
      }).catch((err) => {
        console.error(err);
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
