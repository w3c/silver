require 'open3'
require 'govuk_template/version'
require 'packager/tar_packager'
require 'compiler/play_processor'

module Packager
  class PlayPackager < TarPackager
    def initialize
      super
      @base_name = "play_govuk_template-#{GovukTemplate::VERSION}"
    end

    def build
      @target_dir = @repo_root.join('pkg', @base_name)
      @target_dir.rmtree if @target_dir.exist?
      @target_dir.mkpath
      Dir.chdir(@target_dir) do |dir|
        prepare_contents
        create_tarball
      end
    end

    def process_template(file)
      target_dir = @target_dir.join(File.dirname(file))
      target_dir.mkpath
      target_file = File.basename(file, File.extname(file)).sub(/\.html\z/, '.scala.html') # /path/to/foo.html.erb -> foo.scala.html
      File.open(target_dir.join(target_file), 'wb') do |f|
        f.write Compiler::PlayProcessor.new(file).process
      end
    end
  end
end
