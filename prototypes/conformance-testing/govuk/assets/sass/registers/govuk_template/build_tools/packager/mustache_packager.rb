require 'open3'
require 'govuk_template/version'
require_relative 'tar_packager'
require_relative '../compiler/mustache_processor'

module Packager
  class MustachePackager < TarPackager
    def initialize
      super
      @base_name = "mustache_govuk_template-#{GovukTemplate::VERSION}"
    end

    def build
      @target_dir = @repo_root.join('pkg', @base_name)
      @target_dir.rmtree if @target_dir.exist?
      @target_dir.mkpath
      Dir.chdir(@target_dir) do |dir|
        generate_package_json
        prepare_contents
        create_tarball
      end
    end

    def generate_package_json
      template_abbreviation = "mustache"
      template_name = "{{ mustache }}"
      contents = ERB.new(File.read(File.join(@repo_root, "source/package.json.erb"))).result(binding)
      File.open(File.join(@target_dir, "package.json"), "w") do |f|
        f.write contents
      end
    end

    def process_template(file)
      target_dir = @target_dir.join(File.dirname(file))
      target_dir.mkpath
      File.open(target_dir.join(generated_file_name(file)), 'wb') do |f|
        f.write Compiler::MustacheProcessor.new(file).process
      end
    end

    private

    def generated_file_name(file_path)
      File.basename(file_path, File.extname(file_path))
    end
  end
end
