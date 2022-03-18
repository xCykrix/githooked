/**
 * The argument validation function used to check incoming Deno.args after parsing.
 *
 * @param allowed The list of allowed arguments without '--' or '-' included.
 * @param argument The base argument prior to internal processing.
 * @param key The stripped down argument after internal processing.
 *
 * @returns - Will return true if the argument is valid and allowed. Otherwise generate and throw an error.
 */
export function validate(
  allowed: string[],
  argument: string,
  key?: string,
): boolean {
  if (key === undefined || !allowed.includes(key)) {
    throw new Error(
      `Failed to validate the inbound argument from the parsed values. [Position: ${argument}]`,
    );
  }
  return true;
}
