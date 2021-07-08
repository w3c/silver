# 0.15.1

- Fix copyright logo in Ruby version

# 0.15.0

- Add print specific logo styles

# 0.14.3

- Fix jumping logo on hover

# 0.14.2

- Drop Windows Safari font printing workaround as the font is no longer used in print
- Update the logo to print black-on-white instead of white-on-black

# 0.14.1

- Stop copyright entity being escaped in Jinja template

# 0.14.0

- Update Crown Copyright link to new URL
- Update the font-files and move woffs into CSS
- All user-visible text in the template can now be overridden. Some template languages which don't support default values (such as plain mustache) will therefore lose that text and require you to handle supplying the default.

# 0.13.0

- Add WebJar package
- Bump govuk_frontend_toolkit to 3.5.1
- Add `homepage_url` for overriding the href for the header logo link ("https://www.gov.uk" by default)
- Add `global_header_text` for overriding the header logo text ("GOV.UK" by default)
- Removed deprecated grid layout mixins: https://github.com/alphagov/govuk_template/pull/129

# 0.12.0

- Add: `body_start` to enable html to be placed at the first element of the body
- Add: option to have a single navigation link rather than a full menu

# 0.11.0

- Add support for Embedded JavaScript templates

# 0.10.1

- Add 16x16 favicon for non-retina screens
- Force scrollbar to always display on IE10/11
- Release documents in gh-pages branch
- Fix chunky Firefox fonts

# 0.10.0

- Update OGL link text and destination in footer
- Remove h2 from footer, replacing with `<p>` tag
- Add display: block to HTML5 `<main>` tags
- Set page background colour to match footer background colour

# 0.9.1

- Bump govuk_frontend_toolkit to reset font for print stylesheets

# 0.9.0

- Bump govuk_frontend_toolkit to get new visited link colour
- Add missing params in play template
- Update iOS icon sizes to latest documented by Apple
- Add underline on propositional name links
- Remove star hack in favour of IE specific stylesheet
