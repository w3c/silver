# Integration Tests

When we make changes to govuk_template, we want to know that the changes don't break integration with clients.

This directory contains example integrations for the compiled templates (including ERB/Rails) so that we can test two things:

* is the compiled template syntactically valid?
* has the API changed - has it required any changes in the integration? If so, it should be released as a breaking change.

This is achieved by getting each integration to render HTML from the template, saving it into `./html_for_testing` and then running assertions against each of those HTML files.

## Requirements of each integration

Each integration needs to have an executable script called `build.sh` which:

* pulls in the relevant built package from `pkg/`, (or the compiled template from `govuk_template/app`)
* installs all dependencies
* renders the appropriate template and saves it to disk in `integration_tests/html_for_testing/<app_name>.html`
