#! /bin/bash
set -e

rm -rf vendor/mustache_inheritance_govuk_template/*

mkdir -p vendor/mustache_inheritance_govuk_template

# strip-components lets us decompress into a directory without a version number
# TODO: Pick the latest, not every matching tgz file!
tar -zxf ../../../pkg/mustache_inheritance_govuk_template-*.tgz -C vendor/mustache_inheritance_govuk_template --strip-components 1

npm install

node build.js
