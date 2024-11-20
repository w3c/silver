require 'yaml'
require 'open3'
require 'sprockets'

module Compiler
  class AssetCompiler

    def on_darwin?
      RbConfig::CONFIG['host_os'] =~ /darwin/
    end

    def self.compile
      new.compile
    end

    def initialize
      @repo_root = Pathname.new(File.expand_path('../../..', __FILE__))
      @build_dir = @repo_root.join('app')

      @manifests = YAML.load_file(@repo_root.join('manifests.yml'))
      @stylesheet_assets = []
      @static_assets = []
    end

    def compile
      prepare_build_dir
      compile_javascripts
      compile_stylesheets
      copy_views
      copy_static_assets
      copy_needed_toolkit_assets
    end

    def compile_javascripts
      env = Sprockets::Environment.new(@repo_root)
      env.append_path "source/assets/javascripts"

      @manifests["javascripts"].each do |javascript|
        asset = env.find_asset(javascript)

        abort "Asset #{javascript} not found" unless asset
        target_file = @build_dir.join('assets', 'javascripts', asset.logical_path)
        target_file.dirname.mkpath
        File.open(target_file, 'w') {|f| f.write asset.to_s }
      end
    end

    def compile_stylesheets
      env = Sprockets::Environment.new(@repo_root)
      env.append_path "source/assets/stylesheets"
      env.append_path File.join(Gem.loaded_specs["govuk_frontend_toolkit"].full_gem_path, 'app', 'assets', 'stylesheets')

      stylesheet_assets = [] # This has to be a local variable so that it's in scope for the asset_path method
      env.context_class.class_eval do
        define_method :asset_path do |path, options = {}|
          stylesheet_assets << path
          "<%= asset_path '#{path}' %>"
        end
      end

      @manifests["stylesheets"].each do |stylesheet|
        asset = env.find_asset(stylesheet)

        abort "Asset #{stylesheet} not found" unless asset
        File.open(@build_dir.join('assets', 'stylesheets', "#{asset.logical_path}.erb"), 'w') {|f| f.write asset.to_s }
      end
      @stylesheet_assets = stylesheet_assets.uniq
    end

    def copy_views
      Dir.chdir @repo_root.join("source", "views") do
        files = []
        Dir.glob("**/*") do |file|
          next if File.directory?(file)
          files << file
        end

        if on_darwin?
          output, status = Open3.capture2e("rsync -R #{files.shelljoin} #{@build_dir.join('views').to_s.shellescape}")
        else
          output, status = Open3.capture2e("cp -r --parents #{files.shelljoin} #{@build_dir.join('views').to_s.shellescape}")
        end

        abort "Error copying views:\n#{output}" if status.exitstatus > 0
      end
    end

    def copy_static_assets
      excluded_extensions = %w(.js .css .scss .erb)

      Dir.chdir @repo_root.join("source", "assets") do
        files = []
        Dir.glob("**/*") do |file|
          next if File.directory?(file)
          next if excluded_extensions.include?(File.extname(file))
          files << file
        end

        if on_darwin?
          output, status = Open3.capture2e("rsync -R #{files.shelljoin} #{@build_dir.join('assets').to_s.shellescape}")
        else
          output, status = Open3.capture2e("cp -r --parents #{files.shelljoin} #{@build_dir.join('assets').to_s.shellescape}")
        end
        abort "Error copying files:\n#{output}" if status.exitstatus > 0

        # Strip leading path component to get logical path as referenced in stylesheets
        @static_assets = files.map {|f| f.sub(%r{\A[^/]+/}, '') }
      end
    end

    def copy_needed_toolkit_assets
      needed_assets = @stylesheet_assets - @static_assets

      env = Sprockets::Environment.new(@repo_root)
      env.append_path File.join(Gem.loaded_specs["govuk_frontend_toolkit"].full_gem_path, 'app', 'assets', 'images')

      needed_assets.each do |asset_name|
        asset = env.find_asset(asset_name)
        abort "Asset #{asset_name} not found" unless asset

        # Move the images into the stylesheets folder so they are relative to the stylesheets which call them
        file_dest = @build_dir.join('assets', 'stylesheets', asset.logical_path)
        file_dest.dirname.mkpath unless File.directory?(file_dest.dirname)
        File.open(file_dest, 'wb') {|f| f.write asset.source }
      end
    end

    private

    def prepare_build_dir
      @build_dir.rmtree if @build_dir.exist?
      @build_dir.mkpath
      @build_dir.join('assets', 'stylesheets').mkpath
      @build_dir.join('assets', 'javascripts').mkpath
      @build_dir.join('views').mkpath
    end
  end
end
