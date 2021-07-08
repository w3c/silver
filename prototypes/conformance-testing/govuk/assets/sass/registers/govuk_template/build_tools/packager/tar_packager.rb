require 'open3'
require 'govuk_template/version'
require_relative '../compiler/plain_processor'

module Packager
  class TarPackager
    def on_darwin?
      RbConfig::CONFIG['host_os'] =~ /darwin/
    end

    def self.build
      new.build
    end

    def initialize
      @repo_root = Pathname.new(File.expand_path('../../..', __FILE__))
      @base_name = "govuk_template-#{GovukTemplate::VERSION}"
    end

    def build
      Dir.mktmpdir("govuk_template") do |dir|
        @target_dir = Pathname.new(dir).join(@base_name)
        @target_dir.mkpath
        prepare_contents
        create_tarball
      end
    end

    def prepare_contents
      Dir.chdir @repo_root.join("app") do
        Dir.glob("**/*") do |file|
          next if File.directory?(file)
          case File.extname(file)
          when '.erb'
            process_template(file)
          else
            copy_file(file)
          end
        end
      end
      File.open(@target_dir.join('VERSION'), 'w') {|f| f.write "#{GovukTemplate::VERSION}\n" }
    end

    def process_template(file)
      target_dir = @target_dir.join(File.dirname(file))
      target_dir.mkpath
      target_file = File.basename(file, File.extname(file))
      File.open(target_dir.join(target_file), 'wb') do |f|
        f.write Compiler::PlainProcessor.new(file).process
      end
    end

    def copy_file(file)
      if on_darwin?
        output, status = Open3.capture2e("rsync -R #{file.shellescape} #{@target_dir.to_s.shellescape}")
      else
        output, status = Open3.capture2e("cp --parents #{file.shellescape} #{@target_dir.to_s.shellescape}")
      end
      abort "Error copying file #{file}:\n#{output}" if status.exitstatus > 0
    end

    def create_tarball
      Dir.chdir(@target_dir.join('..')) do
        @repo_root.join("pkg").mkpath
        target_file = @repo_root.join("pkg", "#{@base_name}.tgz").to_s
        output, status = Open3.capture2e("tar -czf #{target_file.shellescape} #{@base_name.shellescape}")
        abort "Error creating tar:\n#{output}" if status.exitstatus > 0
      end
    end
  end
end
