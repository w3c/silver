require 'erb'
require_relative 'template_processor'

module Compiler
  class PlainProcessor < TemplateProcessor
    def handle_yield(section = :layout)
      if section == :layout
        "<!-- Page content goes here -->"
      end
    end

    def content_for?(*args)
      false
    end

    def asset_path(file, options={})
      return file if @is_stylesheet
      case File.extname(file)
      when '.css'
        "/assets/stylesheets/#{file}"
      when '.js'
        "/assets/javascripts/#{file}"
      else
        "/assets/images/#{file}"
      end
    end
  end
end
