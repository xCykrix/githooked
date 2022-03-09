
install:
	deno install
run:
	deno run --no-check=remote --allow-run --allow-read --allow-write --config deno.jsonc mod.ts
test:
	deno test --no-check=remote --config deno.jsonc
lint:
	deno lint --config deno.jsonc
format:
	deno fmt --config deno.jsonc