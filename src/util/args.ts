import { Args } from '../../deps.ts';
import { logger } from "../../mod.ts";

/**
 * The argument validation function used by 'unknown' in the 'parse' function.
 * 
 * @param arg The base argument prior to processing.
 * @param key The stripped down argument key.
 * @returns - Will return true if the argument is valid and allowed. Otherwise generate an error and exit with code 1.
 */
export function validate(allowed: string[], arg: string, key?: string): boolean {
  if (key !== undefined && !allowed.includes(key)) {
    logger.error(`Unknown argument provided: '${arg}'`);
    logger.always('Please use "--help" to see the available options to correct this issue.');
    Deno.exit(1);
  }
  return true;
}

/**
 * Detect the install type to be used by the application.
 * 
 * @param args The Deno {@link Args} to be used.
 * @returns - The install type to be used from {@link InstallMode}.
 */
export function detect(command: InstallCommand, args: Args): InstallMode {
  // Parse for list-hooks and list-scripts before command check.
  if (args['list-hooks'] || args['l'] || args['list-scripts'] || args['s']) {
    if ((args['list-hooks'] || args['l']) && (args['list-scripts'] || args['s'])) {
      return 'list_hooks_and_scripts';
    }
    if (args['list-hooks'] || args['l']) {
      return 'list_hooks';
    }
    if (args['list-scripts'] || args['s']) {
      return 'list_scripts';
    }
  }

  // Parse for the 'run' command.
  if (command === 'run') {
    return 'run_script'
  }

  // Fallback to 'install' command as default.
  if (args['dry-run']) {
    return 'dry_install';
  }
  return 'full_install';
}

export type InstallCommand = 'install' | 'run';

export type InstallMode =
  | 'full_install'
  | 'dry_install'
  | 'run_script'
  | 'list_hooks_and_scripts'
  | 'list_hooks'
  | 'list_scripts';