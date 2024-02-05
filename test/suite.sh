set -eu

configure() {
  # Build Base
  id=$(basename -- $1)
  base="/tmp/assertion-$id"

  # Initialize File System.
  rm -rf "$base"
  mkdir -p "$base"

  # Copy FS
  cp -f "./dist/githooked" "$base"

  # Move to Base
  cd "$base"

  # Initilize Git Constructs
  git init --quiet
  git config user.name "Testing Account GitHooked"
  git config user.email "githooked@xCykrix.dev"
  echo "content" > validation_file
  git add . 1>/dev/null
  git commit -m "ref: add validation_file" 1>/dev/null

  # Enable GitHooked
  chmod +x githooked
}

assert_code() {
  set +e
  bash "$2" ${@:3}
  ec="$?"
  set -e
  if [ $ec != "$1" ]; then
    echo "test-suite (error): expected '$2' to exit with '$1' but got '$ec'."
    exit 127
  fi
}

validate_hooks_path() {
  hooks=$(git config core.hooksPath)
  if [ "$hooks" != "$1" ]; then
    echo "test-suite (error): expected 'core.hooksPath' to be '$1' but got '$hooks'"
  fi
}
