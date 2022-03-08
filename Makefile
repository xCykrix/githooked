
run:
	deno run --no-check=remote --config deno.jsonc mod.ts
lint:
	deno lint --config deno.jsonc
format:
	deno fmt
test:
	deno test --no-check=remote --config deno.jsonc
bundle:
	rm -rf build
	mkdir build
	deno bundle --no-check=remote --config deno.jsonc mod.ts build/mod.js