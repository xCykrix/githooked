info() {
  if [[ -z "${args[--quiet]}" || "${args[--quiet]}" -lt 1 ]]; then
    echo "$(green_bold info) $1"
  fi
}

trace() {
  if [[ ! -z "${args[--trace]}" || "${args[--trace]}" -eq 1 ]]; then
    echo "$(blue_bold trace) $1"
  fi
}

error() {
  if [[ "${args[--quiet]}" -lt 2 ]]; then
    echo "$(red error) $1"
  fi
}
