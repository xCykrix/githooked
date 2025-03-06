#!/bin/bash
shopt -s extglob

info "Installing 'githooked' to the current path..."

# Validate '.git' exists.
info "Validating that project has '.git' for hooks."
trace "check_exist .git"
if [ ! -d ".git" ]; then
  error "Failed to validate '.git' is present."
  error "Please ensure that 'git init' has been executed and at least one commit has been made. You can also review the above output to identify the error."
  exit 1
fi

# Execute 'git rev-parse'.
info "Validating that project is valid for git tracking."
trace "git rev-parse HEAD"
GIT_REVPARSE_HASH=$(git rev-parse HEAD)
GIT_REVPARSE_EXIT=$?

# Fail out if non-zero exit code was found.
if [ "$GIT_REVPARSE_EXIT" -gt 0 ]; then
  error "Failed to validate rev-parse. Exited with code '$GIT_REVPARSE_EXIT' instead of code '0'."
  error "Please ensure that 'git init' has been executed and at least one commit has been made. You can also review the above output from rev-parse."
  exit 1
fi

# Fail out if no hash was found.
if [ -z "$GIT_REVPARSE_HASH" ]; then
  error "Failed to detect hash from rev-parse. Found '$GIT_REVPARSE_HASH'."
  error "Please ensure that 'git init' has been executed and at least one commit has been made. You can also review the above output from rev-parse."
  exit 1
fi

# Update './.git-hooks'.
# Set the working state.
PWD="$(pwd)"
GIT_HOOKS="$PWD/.git-hooks"
UTIL="$GIT_HOOKS/_util"

# Progress update.
info "Generating '$GIT_HOOKS'."

# Ensure file path(s) exist recursively.
trace "mkdir -p '$UTIL'"
mkdir -p "$UTIL"

# Upsert '$UTIL/.gitignore'.
trace "build_gitignore: '$UTIL/.gitignore'"
build_gitignore "$UTIL/.gitignore"

# Upsert '$UTIL/git-hooked.sh'.
trace "build_githooked: '$UTIL/git-hooked.sh'"
build_githooked "$UTIL/git-hooked.sh"

# Check if any hooks exist. If not, we will generate defaults.
GITHOOKED_HAS_DEFAULT_HOOK=0
for HOOK_PATH in ./.git-hooks/*; do
  if [ -f "$HOOK_PATH" ] && [[ ! "$HOOK_PATH" == *"_util"* ]]; then
    trace "detect path '$HOOK_PATH'"
    GITHOOKED_HAS_DEFAULT_HOOK=1
    break
  fi
done
if [ "$GITHOOKED_HAS_DEFAULT_HOOK" == "0" ]; then
  info "Generating default hooks."
  for HOOK in $(default_hooks); do
    trace "build_hook: '$HOOK'"
    build_hook "$GIT_HOOKS/$HOOK"
  done
fi

# Update permissions and set to execute.
info "Setting file permissions for hooks."
for HOOK_PATH in ./.git-hooks/*; do
  if [ -f "$PWD/$HOOK_PATH" ] && [[ ! "$HOOK_PATH" == *"_util"* ]]; then
    trace "chmod 755 (+x) '$PWD/$HOOK_PATH'."
    chmod 755 "$PWD/$HOOK_PATH"
    chmod +x "$PWD/$HOOK_PATH"
  fi
done

# Set 'core.hooksPath' to './.git-hooks'.
info "Setting 'core.hooksPath' to './.git-hooks'."
trace "git config core.hooksPath './.git-hooks/'"
git config core.hooksPath "./.git-hooks/"
