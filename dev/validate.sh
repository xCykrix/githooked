#!/bin/bash

validate_shfmt() {
  if ! [ -x "$(command -v shfmt)" ]; then
    echo 'Error: shfmt is not installed. Development is designed for Ubuntu 22.04 or later.' >&2
    echo 'Please install via "sudo snap install shfmt" for shfmt to be accessible.' >&2
    exit 1
  fi

  shfmt -l -d src
}

test_cli() {
  . test/suite.sh
  for test in "test"/*; do
    if [[ "$test" =~ test\..* ]]; then
      echo "test-suite (info): evaluate '$test'"
      chmod +x $test
      assert_code 0 "$test" "$test"
    fi
  done
}

validate_shfmt
test_cli
