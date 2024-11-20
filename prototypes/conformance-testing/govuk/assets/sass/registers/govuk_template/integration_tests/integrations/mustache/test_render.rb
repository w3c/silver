require 'rubygems'
require 'bundler'

Bundler.require

# We don't want to hard-code the version number, so have to use a glob pattern
path_to_template = Dir.glob("vendor/mustache_govuk_template-*/views/layouts/govuk_template.html").last

parameters = {
  htmlLang: 'rb',
  pageTitle: "This is a custom page title",
  head: "<inserted-into-head></inserted-into-head>",
  bodyClasses: "custom_body_class",
  bodyStart: "<inserted-into-body-start></inserted-into-body-start>",
  cookieMessage: "Custom cookie message",
  headerClass: "custom_header_class",
  insideHeader: "<inside-header></inside-header>",
  propositionHeader: "<proposition-header></proposition-header>",
  afterHeader: "<after-header></after-header>",
  content: "The page content",
  footerTop: "<footer-top></footer-top>",
  footerSupportLinks: "<footer-support-links></footer-support-links>",
  bodyEnd: "<body-end></body-end>",
  skipLinkMessage: "Custom skip link text",
  logoLinkTitle: "Custom logo link title text",
  licenceMessage: "Custom license message text",
  crownCopyrightMessage: "Custom crown copyright message text",
}

output = Mustache.render(File.read(path_to_template), parameters)

output_path = "#{File.expand_path('../../../', __FILE__)}/html_for_testing/mustache_integration_test_app.html"

File.write(output_path, output)
