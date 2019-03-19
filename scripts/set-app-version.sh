#!/bin/bash

: ${TRAVIS_TAG:?"TRAVIS_TAG env is required!"}

sed -i -r -e "s/(\"version\": ).*/\1\"$TRAVIS_TAG\",/g" ./package.json
sed -i -r -e "s/(\"version\": ).*/\1\"$TRAVIS_TAG\",/g" ./src/www/package.json
