info "Preparing to generate selected hooks."

# Load Environment Variables
PWD="$(pwd)"
GIT_HOOKS="$PWD/.git-hooks"
HOOKS="${args[hook]}"

# Loop each selected hook and generate.
info "Generating selected hooks..."
for HOOK in $HOOKS; do
  # Normlize the hook identifier.
  HOOK=$(echo $HOOK | tr -d '"')

  # Call build_hook to generate file.
  info "build_hook: '$GIT_HOOKS/$HOOK'"
  build_hook "$GIT_HOOKS/$HOOK"
done
