#!/bin/bash

validate_shfmt() {
  if ! [ -x "$(command -v shfmt)" ]; then
    echo 'Error: shfmt is not installed. Development is designed for Ubuntu 22.04 or later.' >&2
    echo 'Please install via "sudo snap install shfmt" for shfmt to be accessible.' >&2
    exit 1
  fi

  shfmt -l -d src
}