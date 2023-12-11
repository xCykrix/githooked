#!/bin/bash

# Wipe and create 'dist' for clean build.
rm -r dist && mkdir -p dist

# Build Project
bashly generate --env production