require 'action_controller'

class TemplateRenderer < AbstractController::Base
  include AbstractController::Rendering
  include ActionView::Layouts
  include AbstractController::Helpers
  include AbstractController::Translation
  include AbstractController::AssetPaths

  self.view_paths = [
    "views",
    File.absolute_path(File.expand_path(File.join(__FILE__, "../../../../app/views"))) # Hack to manually add the compiled template path
  ]

  layout "govuk_template"

  def show
    render template: "show"
  end
end

rendered_template = TemplateRenderer.new.show

output_filepath = File.absolute_path(File.expand_path(File.join(__FILE__, "../../../html_for_testing/rails_integration_test_app.html")))

File.write(output_filepath, rendered_template)
