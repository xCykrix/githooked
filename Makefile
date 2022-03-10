# Local Developer Scripts. Use these when configuring for local development.
initialize:
	deno install --no-check=remote --allow-run=deno,git --allow-read=.git-hooks,.git --allow-write=.git-hooks -f -n git-hooked ./mod.ts
	git-hooked install -q
upgrade:
	deno cache --no-check=remote --reload ./mod.ts

# Lifecycle Scripts. These are used for automation and tooling purposes.
lint:
	deno lint --config deno.jsonc
format:
	deno fmt --config deno.jsonc
build:
	deno cache --no-check=remote --reload ./mod.ts
	deno install --no-check=remote --allow-run=deno,git --allow-read=.git-hooks,.git --allow-write=.git-hooks -f -n git-hooked ./mod.ts
test:
	deno test --no-check=remote --config deno.jsonc
all:
	make lint
	make format
	make build
	# make test