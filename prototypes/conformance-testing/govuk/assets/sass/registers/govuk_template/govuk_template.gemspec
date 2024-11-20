# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'govuk_template/version'

Gem::Specification.new do |spec|
  spec.name          = "govuk_template"
  spec.version       = GovukTemplate::VERSION
  spec.authors       = ["Alex Tomlins"]
  spec.email         = ["alex.tomlins@digital.cabinet-office.gov.uk"]
  spec.summary       = %q{Rails engine supplying the GOV.UK header/footer template}
  spec.description   = spec.summary
  spec.homepage      = "https://github.com/alphagov/govuk_template"
  spec.license       = "MIT"

  spec.files         = Dir["{app,lib}/**/*"] + ["LICENCE.txt", "README.md"]
  spec.require_paths = ["lib"]

  spec.add_dependency "rails", ">= 3.1"

  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'sprockets', '2.10.0'
  spec.add_development_dependency 'sass', '3.2.9'
  spec.add_development_dependency 'govuk_frontend_toolkit', '3.5.1'
  spec.add_development_dependency 'gem_publisher', '1.3.0'
  spec.add_development_dependency 'rspec', '3.2.0'
  spec.add_development_dependency 'rspec-html-matchers', '0.7.0'
  spec.add_development_dependency 'mustache', '0.99.7'
  spec.add_development_dependency 'nokogiri', '1.6.6.2'
  spec.add_development_dependency 'octokit', '3.4.2'
end
