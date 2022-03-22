/** Systematic information related to the project. */
export const name = 'githooked';
export const description =
  'Git hooks for the Deno lifecycle. Inspired by Typicode\'s Husky.';
export const version = '0.1.1';

/** https://deno.land/std/flags/mod.ts - flags */
export { parse } from 'https:/deno.land/std@0.130.0/flags/mod.ts';
export type { Args } from 'https:/deno.land/std@0.130.0/flags/mod.ts';

/** https://deno.land/std/path/mod.ts - path */
export {
  dirname,
  fromFileUrl,
  resolve,
} from 'https:/deno.land/std@0.130.0/path/mod.ts';

/** https://deno.land/x/cliffy/command/mod.ts - cliffy */
export {
  Command,
  EnumType,
} from 'https://deno.land/x/cliffy@v0.22.2/command/mod.ts';

/** https:/deno.land/x/permissions_manager/mod.ts - permission_manager */
export {
  check,
  grant,
  revoke,
} from 'https:/deno.land/x/permissions_manager@v0.0.1/mod.ts';
