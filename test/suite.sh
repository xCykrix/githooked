#!/bin/bash

BASE_DIR="$(dirname -- "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(pwd)/$BASE_DIR"
echo "Suite: $(pwd)/$BASE_DIR"
cd "$SCRIPT_DIR"
APPROVALS_DIR=$SCRIPT_DIR/approvals

wget get.dannyb.co/approvals.bash -O approvals.bash -q
source approvals.bash

rm -rf ../dist/tmp/
mkdir -p ../dist/tmp/

# Context: Verifying Help Function
context "Verifying Help Function"

describe "githooked"
it "Running 'githooked' will display the basic help menu."
approve "../dist/githooked"

describe "githooked --help"
it "Running 'githooked --help' will display an advanced help menu."
approve "../dist/githooked --help"

describe "githooked install --help"
it "Running 'githooked install --help' will display the install help."
approve "../dist/githooked install --help"

# Context: Verifying Actual Function
context "Verifying Actual Function"
TEMP_DIR=$(mktemp -d -p ../dist/tmp/)
cd "$TEMP_DIR"

# Region: githooked install - setup - start
git init --quiet
git config user.name "Testing Account GitHooked"
git config user.email "githooked@xCykrix.dev"
echo "content" >validation_file
git add . 1>/dev/null
git commit -m "ref: add validation_file" 1>/dev/null
# Region: githooked install - setup - end

describe "githooked install"
it "Should install to the tmp directory."
allow_diff "tmp.*\/.git-hooks"
approve "../../githooked install"

describe "githooked install - post verification"
it "Should verify install and default hooks exists with ls."
approve "ls .git-hooks/prepare-commit-msg # pre-verify"

describe "githooked generate"
it "Should create a 'post-commit' git-hook."
allow_diff "tmp.*\/.git-hooks"
approve "../../githooked generate post-commit"

describe "githook generate - post verification"
it "Should verify 'post-commit' exists with ls."
approve "ls .git-hooks/post-commit # post-verify"

context "Verifying Expected Failure"
cd "$SCRIPT_DIR"
TEMP_DIR=$(mktemp -d -p ../dist/tmp/)
cd "$TEMP_DIR"

describe "githooked install - install fail"
it "Should attempt to install and return an exit code."
allow_diff "tmp.*\/.git-hooks"
approve "../../githooked install # expect error"
