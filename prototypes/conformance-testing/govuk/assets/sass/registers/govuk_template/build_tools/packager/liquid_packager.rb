require 'open3'
require 'govuk_template/version'
require_relative 'tar_packager'
require_relative '../compiler/liquid_processor'

module Packager
  class LiquidPackager < TarPackager
    def initialize
      super
      @base_name = "liquid_govuk_template-#{GovukTemplate::VERSION}"
    end

    def process_template(file)
      target_dir = @target_dir.join(File.dirname(file))
      target_dir.mkpath
      target_file = File.basename(file, File.extname(file))
      File.open(target_dir.join(target_file), 'wb') do |f|
        f.write Compiler::LiquidProcessor.new(file).process
      end
    end
  end
end
