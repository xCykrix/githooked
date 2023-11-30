info "Preparing to generate selected hooks."

# Update './.git-hooks'.
# Set the working state.
PWD="$(pwd)"
GIT_HOOKS="$PWD/.git-hooks"
HOOKS="${args[hook]}"

info "Generating selected hooks."
for HOOK in $HOOKS; do
  HOOK=$(echo $HOOK | tr -d '"')
  trace "build_hook: '$GIT_HOOKS/$HOOK'"
  build_hook "$GIT_HOOKS/$HOOK"
done
