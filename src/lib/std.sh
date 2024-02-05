info() {
  if [[ -z "${args[--quiet]}" || "${args[--quiet]}" -eq 0 ]]; then
    echo "$(green_bold info) $1"
  fi
}

trace() {
  if [[ ! -z "${args[--trace]}" || "${args[--trace]}" -eq 1 ]]; then
    echo "$(blue_bold trace) $1"
  fi
}

error() {
  echo "$(red error) $1"
}
