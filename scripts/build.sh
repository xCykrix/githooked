rm -r ./dist/

deno compile \
  --no-check=remote \
  --allow-run=chmod,git \
  --allow-read \
  --allow-write=.git-hooks \
  --output=$PWD/dist/githooked \
  --target=x86_64-pc-windows-msvc \
  mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=chmod,git \
  --allow-read \
  --allow-write=.git-hooks \
  --output=$PWD/dist/githooked_linux \
  --target=x86_64-unknown-linux-gnu \
  mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=chmod,git \
  --allow-read \
  --allow-write=.git-hooks \
  --output=$PWD/dist/githooked_apple \
  --target=x86_64-apple-darwin \
  mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=chmod,git \
  --allow-read \
  --allow-write=.git-hooks \
  --output=$PWD/dist/githooked_arch64_apple \
  --target=aarch64-apple-darwin \
  mod.ts install
