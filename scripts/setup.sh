#!/usr/bin/env bash

set -euxo pipefail

ANDROID_DIR=android
IOS_DIR=ios

if [[ "$@" == *"--clean"* ]]; then
  (
    set +e
    echo "Performing clean build..."
    echo "Removing node_modules..."
    rm -rf node_modules
    echo "Removing android and ios directories..."
    rm -rf android ios
    set -e
  )
fi

yarn install

if [[ ! -d "${ANDROID_DIR}" || ! -d "${IOS_DIR}" ]]; then
  echo "Android and/or iOS directories do not exist - performing prebuild..."
  npx expo prebuild 
fi

# re-order Xcode Build Phases to ensure that the Square Build Phase is last
chmod +x ./scripts/square-post-install.rb
./scripts/square-post-install.rb ios/rnsqipfromscratchdemo.xcodeproj rnsqipfromscratchdemo