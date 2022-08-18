deno compile \
  --no-check=remote \
  --allow-run=deno,git \
  --allow-read=.git,.git-hooks \
  --allow-write=.git-hooks \
  --output=$PWD/build/githooked_linux \
  --target=x86_64-unknown-linux-gnu \
  https://raw.githubusercontent.com/amethyst-studio/githooked/main/mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=deno,git \
  --allow-read=.git,.git-hooks \
  --allow-write=.git-hooks \
  --output=$PWD/build/githooked_x86_apple \
  --target=x86_64-apple-darwin \
  https://raw.githubusercontent.com/amethyst-studio/githooked/main/mod.ts install

deno compile \
  --no-check=remote \
  --allow-run=deno,git \
  --allow-read=.git,.git-hooks \
  --allow-write=.git-hooks \
  --output=$PWD/build/githooked_aarch64_apple \
  --target=aarch64-apple-darwin \
  https://raw.githubusercontent.com/amethyst-studio/githooked/main/mod.ts install
