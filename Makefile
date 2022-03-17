# Local Developer Scripts. Use these when configuring for local development.
initialize:
	deno install -f --no-check=remote --allow-run=deno,git --allow-read=.git,.git-hooks --allow-write=.git-hooks https://deno.land/x/githooked/mod.ts
	githooked install -q
upgrade:
	deno cache --no-check=remote --reload ./mod.ts

# Lifecycle Scripts. These are used for automation and tooling purposes.
lint:
	deno lint --config deno.jsonc
format:
	deno fmt --config deno.jsonc
build:
	deno cache --no-check=remote --reload ./mod.ts
	deno install --no-check=remote --allow-run=deno,git --allow-read=.git-hooks,.git --allow-write=.git-hooks -f -n githooked ./mod.ts
test:
	deno test --no-check=remote --config deno.jsonc
all:
	make lint
	make format
	make build
	make test