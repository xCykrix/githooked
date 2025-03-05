#!/bin/bash
set -e

# Wipe and create 'dist' for clean build.
rm -rf ./dist && mkdir -p dist

# Build Project
/usr/local/rvm/gems/default/bin/bashly generate --env development
