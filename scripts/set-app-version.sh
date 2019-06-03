#!/bin/bash

: ${TRAVIS_TAG:?"TRAVIS_TAG env is required!"}

perl -0777 -i -p -e "s/(\"version\": \").*(\")/\${1}$TRAVIS_TAG\${2}/g" ./package.json
perl -0777 -i -p -e "s/(\"version\": \").*(\")/\${1}$TRAVIS_TAG\${2}/g" ./src/www/package.json
