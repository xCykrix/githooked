
install:
	deno cache --no-check=remote --reload https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts
	deno install --no-check=remote --allow-run=git --allow-write=./.git-hooks/ --allow-read=./.git-hooks/,./.git/ -f -n git-hooked https://raw.githubusercontent.com/amethyst-studio/git-hooked/main/mod.ts 
run:
	git-hooked
test:
	deno test --no-check=remote --config deno.jsonc
lint:
	deno lint --config deno.jsonc
format:
	deno fmt --config deno.jsonc