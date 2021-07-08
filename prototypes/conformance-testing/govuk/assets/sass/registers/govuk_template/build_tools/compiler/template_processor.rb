require 'erb'

module Compiler
  class TemplateProcessor

    def initialize(file)
      @file = file
      @is_stylesheet = !!(file =~ /\.css\.erb\z/)
    end

    def process
      # The block supplied to render_erb is invoked every time yield is called
      # in the template. This happens via the `binding`.
      render_erb do |section = :layout|
        handle_yield(section)
      end
    end

    def raw html
      html
    end

    def render_erb
      ERB.new(File.read(@file)).result(binding)
    end

    def handle_yield(section = :layout)
      raise "Not implemented on the base class"
    end

    def content_for?(*args)
      true
    end

    def asset_path(file, options={})
      raise "Not implemented on the base class"
    end

    def method_missing(name, *args)
      puts "#{name} #{args.inspect}"
    end
  end
end
