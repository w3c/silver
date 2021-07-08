module GovukTemplate
  class Engine < ::Rails::Engine
    initializer "govuk_template.assets.precompile" do |app|
      app.config.assets.precompile += %w(
        govuk-template*.css
        fonts*.css
        govuk-template.js
        ie.js
        vendor/goog/webfont-debug.js
      )
    end
  end
end
