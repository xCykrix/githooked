#!/bin/bash
set -e

. test/suite.sh
configure $1
assert_code 0 "./githooked" "--quiet" "install"
validate_hooks_path "./.git-hooks/"
