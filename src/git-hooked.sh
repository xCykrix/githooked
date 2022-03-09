#!/usr/bin/env sh

if [ -z "${SKIP_GIT_HOOKED_INIT}" ]; then
  # Initialize the Debug Logger.
  debug () {
    if [ "${HOOK_DEBUG}" = "1" ]; then
      echo "git-hooked (debug) - ${1}"
    fi
  }
  # Initialize the Notice Logger.
  notice () {
    if [ "${HOOK_DISABLE_NOTICE}" = "0" ]; then
      echo "git-hooked (notice) - ${1}"
    fi
  }

  readonly hook_name="$(basename "${0}")"
  debug "Calling '${hook_name}' ..."

  if [ "${HOOK}" = "0" ]; then
    debug "Skipping the hook due to the environment variable 'HOOK' being set to 0."
  fi

  readonly SKIP_GIT_HOOKED_INIT="1"
  export SKIP_GIT_HOOKED_INIT

  sh -e "${0}" "${@}"
  code="${?}"

  if [ "${code}" != "0" ]; then
    notice "The hook '${hook_name}' exited with code '${code}' (error)."
    notice "Please review the output above to resolve the error. After that, try the git operation again."
  fi
  
  exit "${code}"
fi