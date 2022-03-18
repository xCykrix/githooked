/**
 * The argument validation function used by 'unknown' in the 'parse' function.
 *
 * @param allowed The list of allowed arguments without '--' or '-' included.
 * @param arg The base argument prior to processing.
 * @param key The stripped down argument key.
 *
 * @returns - Will return true if the argument is valid and allowed. Otherwise generate and throw an error.
 */
export function validate(
  allowed: string[],
  arg: string,
  key?: string,
): boolean {
  if (key === undefined || !allowed.includes(key)) {
    throw new Error(
      `Failed to validate the inbound argument from the parsed values. [Position: ${arg}]`,
    );
  }
  return true;
}
