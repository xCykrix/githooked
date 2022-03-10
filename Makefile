
install:
	deno cache --no-check=remote --reload ./mod.ts
	deno install --no-check=remote --allow-run=deno,git --allow-read=./.git-hooks/,./.git/ --allow-write=./.git-hooks/ -f -n git-hooked ./mod.ts 
upgrade:
	deno cache --no-check=remote --reload ./mod.ts
run:
	git-hooked
test:
	deno test --no-check=remote --config deno.jsonc
lint:
	deno lint --config deno.jsonc
format:
	deno fmt --config deno.jsonc