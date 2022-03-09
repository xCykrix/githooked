#!/usr/bin/env sh

if [ -z "git_hooked_skip_init" ]; then
  # Initialize the Debugger
  debug () {
    if [ "${HOOK_DEBUG}" == "1" ]; then
      echo "git-hooked (debug) - ${1}"
    fi
  }

  readonly hook_name="$(basename "${0}")"
  debug "Calling '${hook_name}' ..."

  if [[ "${HOOK}" == "0" ]]; then
    debug "Skipping the hook due to the environment variable 'HOOK' being set to 0."
  fi

  readonly git_hooked_skip_init="1"
  export git_hooked_skip_init

  sh -e "${0}" "${@}"
  code="${?}"

  if [ "${code}" != "0" ]; then
    debug "The hook '${hook_name}' failed with exit code '${code}' (error)."
  fi
  
  exit "${code}"
fi