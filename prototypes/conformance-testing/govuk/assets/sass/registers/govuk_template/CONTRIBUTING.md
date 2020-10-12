# Contribution Guidelines

We welcome patches to the toolkit, as long as you follow these guidelines:

## Git workflow ##

- Pull requests must contain a succint, clear summary of what the user need is driving this feature change.
- Follow our [Git styleguide](https://github.com/alphagov/styleguides/blob/master/git.md)
- Make a feature branch
- Ensure your branch contains logical atomic commits before sending a pull request - follow our [Git styleguide](https://github.com/alphagov/styleguides/blob/master/git.md)
- Pull requests are automatically integration tested, where applicable using [Travis CI](https://travis-ci.org/), which will report back on whether the tests still pass on your branch
- You *may* rebase your branch after feedback if it's to include relevant updates from the master branch. We prefer a rebase here to a merge commit as we prefer a clean and straight history on master with discrete merge commits for features

## Copy ##

- Follow the [style guide](https://www.gov.uk/designprinciples/styleguide)
- URLs should use hyphens, not underscores

## Code ##

- Must be readable with meaningful naming, eg no short hand single character variable names
- Follow our [Ruby style guide](https://github.com/alphagov/styleguides/blob/master/ruby.md)

## Testing ##

Write tests.

## Versioning ##

We use [Semantic Versioning](http://semver.org/), and bump the version
on master only. Please don't submit your own proposed version numbers.
