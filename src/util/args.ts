import { logger } from '../../mod.ts';

/**
 * The argument validation function used by 'unknown' in the 'parse' function.
 *
 * @param arg The base argument prior to processing.
 * @param key The stripped down argument key.
 * @returns - Will return true if the argument is valid and allowed. Otherwise generate an error and exit with code 1.
 */
export function validate(
  allowed: string[],
  arg: string,
  key?: string,
): boolean {
  if (key !== undefined && !allowed.includes(key)) {
    logger.error(
      `Invalid argument was provided. Please check the previously executed command. Invalid at: '${arg}'`,
    );
    logger.always(
      `Please use '--help' to see the available options to correct this issue. Code: 4`,
    );
    Deno.exit(4);
  }
  return true;
}
