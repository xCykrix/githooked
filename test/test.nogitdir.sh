#!/bin/bash

. test/suite.sh
configure $1
rm -rf '.git'
assert_code 1 "./githooked" "-qq" "install"
