import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std/testing/asserts.ts';
import { validate } from './args.ts';

// Define the QA UnitTest for 'validate()' in the runtime.
Deno.test('validate()', async (test) => {
  await test.step('if valid input returns expected result', () => {
    assertEquals(validate(['test', 't'], '--inv', 'test'), true);
  });
  await test.step('if invalid input returns expected result', () => {
    assertThrows(
      () => {
        validate(['test', 't'], '--inv', 'inv');
      },
      Error,
      'validate the inbound argument',
    );
  });
  await test.step('if blank input returns the expected result', () => {
    assertThrows(
      () => {
        validate([], '');
      },
      Error,
      'validate the inbound argument',
    );
  });
});
