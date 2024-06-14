#!/bin/bash

set -e

rm -f Gemfile.lock
git clean -fdx
bundle install --path "${HOME}/bundles/${JOB_NAME}"

bundle exec rake spec integration_tests

# If $PUBLISH_TEMPLATE is set, try and release the template
if [[ -n "$PUBLISH_TEMPLATE" ]]; then
  bundle exec rake build:and_release_if_updated
fi
