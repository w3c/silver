#! /bin/bash
set -e

bundle install --path vendor/bundle

bundle exec ruby simplicity.rb
