require 'govuk_template/version'
require 'tmpdir'
require 'open3'
require 'mustache'
require 'yaml'

module Publisher
  class DocsPublisher
    GIT_URL = "git@github.com:alphagov/govuk_template"

    def initialize(version = GovukTemplate::VERSION)
      @version = version
      @repo_root = Pathname.new(File.expand_path('../../..', __FILE__))
      @pkg_dir = @repo_root.join('pkg')
      @mustache_dir = @pkg_dir.join("mustache_govuk_template-#{@version}")
    end

    def publish
      Dir.mktmpdir("govuk_template_docs") do |dir|
        run "git clone -q #{GIT_URL.shellescape} #{dir.shellescape} --branch gh-pages"
        Dir.chdir(dir) do
          # Remove old assets
          FileUtils.rm_r("assets", force: true)

          # Copy assets folder to current path
          FileUtils.cp_r("#{@mustache_dir}/assets", "./")

          # Load mustache template
          mustache_template = File.read("#{@mustache_dir}/views/layouts/govuk_template.html")

          # Loop over all stub data files
          Dir['data/*.yml'].each do |data_file_path|
            base = File.basename(data_file_path, '.yml')

            # Load data file and render mustache with that data
            mustache_data = YAML.load(File.read(data_file_path))
            template = Mustache.render(mustache_template, mustache_data)
            template = template.gsub('VERSION_NAME', @version)

            # Save the rendered file
            File.open("#{base}.html", "w") do |file|
              file.write(template)
            end
          end

          run "git add -A ."
          run "git commit -q -m 'Publishing govuk_template examples version #{@version}'"
          run "git push origin gh-pages"
        end
      end
    end

    private

    def run(command)
      output, status = Open3.capture2e(command)
      abort "Error running #{command}: exit #{status.exitstatus}\n#{output}" if status.exitstatus > 0
      output
    end
  end
end
