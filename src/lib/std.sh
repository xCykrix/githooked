info() {
  echo "$(green_bold info) $1"
}

trace() {
  if [[ ! -z "${args[--trace]}" || "${args[--trace]}" -eq 1 ]]; then
    echo "$(blue_bold trace) $1"
  fi
}

error() {
  echo "$(red error) $1"
}
