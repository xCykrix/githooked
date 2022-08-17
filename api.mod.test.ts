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
      await Install.update(`${Deno.cwd()}/_TEST_SUITE`, true).then(() => {
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
});

// import { exists } from './lib/util/fs.ts';
// import { git } from './lib/util/git.ts';
// import { Install } from './lib/install.ts';

//   await t.step('install', async () => {
await Install.update(`${Deno.cwd()}/_TEST_SUITE`, true);
// assertEquals(
//   await Install.update(`NOT_A_PATH`).catch(() => {
//     return null;
//   }),
//   null,
// );
//   });

//   await t.step('assert', async () => {
//     assertEquals(
//       await exists(`${Deno.cwd()}/_TEST_SUITE/.git-hooks/`),
//       true,
//     );
//     assertEquals(
//       await exists(
//         `${Deno.cwd()}/_TEST_SUITE/.git-hooks/_util/`,
//       ),
//       true,
//     );
//   });

//   await t.step('clean', async () => {
//     await Deno.remove(`${Deno.cwd()}/_TEST_SUITE`, {
//       recursive: true,
//     });
//   });
// });
