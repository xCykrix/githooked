// std exports
// flags
export { parse } from 'https:/deno.land/std@0.128.0/flags/mod.ts';
export type { Args } from 'https:/deno.land/std@0.128.0/flags/mod.ts';

// path
export {
  dirname,
  fromFileUrl,
  resolve,
} from 'https:/deno.land/std@0.128.0/path/mod.ts';

// x exports

// cliffy
export {
  Command,
  EnumType,
} from 'https://deno.land/x/cliffy@v0.22.2/command/mod.ts';

// permissions_manager
export {
  check,
  grant,
  revoke,
} from 'https:/deno.land/x/permissions_manager@v0.0.1/mod.ts';
