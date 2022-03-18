import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { exists } from './exists.ts';

// Define the QA UnitTest for 'exists()' in the runtime.
Deno.test('exists()', async (test) => {
  await test.step('if valid input returns the expected result', async () => {
    assertEquals(await exists('./src/util/exists.test.ts'), true);
  });
  await test.step('if invalid input returns the expected result', async () => {
    assertEquals(await exists('./src/util/exists.fake.ts'), false);
  });
  await test.step('if random input returns the expected result', async () => {
    assertEquals(await exists('path-that-no-exists'), false);
  });
  await test.step('if blank input returns the expected result', async () => {
    assertEquals(await exists(''), false);
  });
});
