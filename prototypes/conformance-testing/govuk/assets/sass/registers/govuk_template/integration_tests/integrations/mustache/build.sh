#! /bin/bash
set -e

rm -rf vendor/mustache_govuk_template/*

# TODO: Pick the latest, not every matching tgz file!
tar -zxvf ../../../pkg/mustache_govuk_template-*.tgz -C vendor/

bundle install --path vendor/bundle

bundle exec ruby test_render.rb
