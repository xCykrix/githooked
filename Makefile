
run:
	deno run --no-check=remote --allow-run --allow-read --allow-write --config deno.jsonc mod.ts
lint:
	deno lint --config deno.jsonc
format:
	deno fmt --config deno.jsonc
test:
	deno test --no-check=remote --config deno.jsonc