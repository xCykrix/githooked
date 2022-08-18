deno compile \
  --no-check=remote \
  --allow-run=deno,git \
  --allow-read=.git,.git-hooks \
  --allow-write=.git-hooks \
  --output=$PWD/build/githooked \
  --target=x86_64-unknown-linux-gnu \
  https://raw.githubusercontent.com/amethyst-studio/githooked/main/mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=deno,git \
  --allow-read=.git,.git-hooks \
  --allow-write=.git-hooks \
  --output=$PWD/build/githooked.exe \
  --target=x86_64-pc-windows-msvc \
  https://raw.githubusercontent.com/amethyst-studio/githooked/main/mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=deno,git \
  --allow-read=.git,.git-hooks \
  --allow-write=.git-hooks \
  --output=$PWD/build/githooked_x86_apple_darwin \
  --target=x86_64-apple-darwin \
  https://raw.githubusercontent.com/amethyst-studio/githooked/main/mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=deno,git \
  --allow-read=.git,.git-hooks \
  --allow-write=.git-hooks \
  --output=$PWD/build/githooked_aarch64_apple_darwin \
  --target=aarch64-apple-darwin \
  https://raw.githubusercontent.com/amethyst-studio/githooked/main/mod.ts install
