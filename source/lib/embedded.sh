#!/bin/bash

build_githooked() {
  cat <<'EOF' >"$1"
#!/usr/bin/env bash

if [ -z "$SKIP_GIT_HOOKED_INIT" ]; then
  # Initialize the Debug Logger.
  debug () {
    if [ "$HOOK_DEBUG" = "1" ]; then
      echo "git-hooked (debug) - $1"
    fi
  }
  # Initialize the Notice Logger.
  notice () {
    if [ "$HOOK_DISABLE_NOTICE" = "0" ]; then
      echo "git-hooked (notice) - $1"
    fi
  }

  # Set and State the Hook
  readonly hook_name="$(basename "$0")"
  debug "Calling '$hook_name' ..."

  if [ "$HOOK" = "0" ]; then
    debug "Skipping the hook due to the environment variable 'HOOK' being set to 0."
  fi

  # Configure the hook to skip this call on the
  readonly SKIP_GIT_HOOKED_INIT="1"
  export SKIP_GIT_HOOKED_INIT

  bash -e "$0" "$@"
  code="$?"

  if [ "$code" != "0" ]; then
    notice "The hook '$hook_name' exited with code '$code' (error)."
    notice "Please review the output above to resolve the error. Once resolved, please attempt the git operation again."
  fi

  exit "$code"
fi
EOF
}

build_hook() {
  if ! [ -f "$1" ]; then
    cat <<'EOF' >"$1"
#!/usr/bin/env bash

# Configure the hook with these options.
HOOK_DEBUG=0          # Set to 1 to enable debug mode. This will print additional output.
HOOK_DISABLE_NOTICE=0 # Set to 1 to disable the notice when the hook exits with an error code.

# Import the git-hooked wrapper to prepare the env and execute the script below.
. "$(dirname "$0")/_util/git-hooked.sh"

# Your script begins here.
# The last command to run, or explicit "exit" commands, will determine the status code to Git.

# Default Hook: Full List of Hooks at https://git-scm.com/docs/githooks#_hooks
exit 0 # NO OP. This quietly passes to prevent spam during configuration.

EOF
  else
    trace "build_hook: (exists) '$1'"
  fi
}

build_gitignore() {
  cat <<'EOF' >"$1"
*
EOF
}

default_hooks() {
  local DEFAULT_HOOKS=("prepare-commit-msg" "pre-commit" "pre-push")
  echo "${DEFAULT_HOOKS[@]}"
}
