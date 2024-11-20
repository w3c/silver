$:.unshift File.expand_path('../lib', __FILE__)
$:.unshift File.expand_path('../build_tools', __FILE__)
require "govuk_template/version"
require "gem_publisher"

desc "Compile template and assets from ./source into ./app"
task :compile do
  require 'compiler/asset_compiler'
  puts "Compiling assets and templates into ./app"
  Compiler::AssetCompiler.compile
end

desc "Build both gem and tar version"
task :build => ["build:gem", "build:tar", "build:play", "build:mustache", "build:liquid", "build:mustache_inheritance", "build:jinja", "build:ejs", "build:webjar"]

namespace :build do
  desc "Build govuk_template-#{GovukTemplate::VERSION}.gem into the pkg directory"
  task :gem => :compile do
    puts "Building pkg/govuk_template-#{GovukTemplate::VERSION}.gem"
    require 'packager/gem_packager'
    Packager::GemPackager.build
  end

  desc "Build govuk_template-#{GovukTemplate::VERSION}.tgz into the pkg directory"
  task :tar => :compile do
    puts "Building pkg/govuk_template-#{GovukTemplate::VERSION}.tgz"
    require 'packager/tar_packager'
    Packager::TarPackager.build
  end

  desc "Build play_govuk_template-#{GovukTemplate::VERSION}.tgz into the pkg directory"
  task :play => :compile do
    puts "Building pkg/play_govuk_template-#{GovukTemplate::VERSION}.tgz"
    require 'packager/play_packager'
    Packager::PlayPackager.build
  end

  desc "Build mustache_govuk_template-#{GovukTemplate::VERSION} into the pkg directory"
  task :mustache => :compile do
    puts "Building pkg/mustache_govuk_template-#{GovukTemplate::VERSION}"
    require 'packager/mustache_packager'
    Packager::MustachePackager.build
  end

  desc "Build liquid_govuk_template-#{GovukTemplate::VERSION} into the pkg directory"
  task :liquid => :compile do
    puts "Building pkg/liquid_govuk_template-#{GovukTemplate::VERSION}"
    require 'packager/liquid_packager'
    Packager::LiquidPackager.build
  end

  desc "Build mustache_inheritance_govuk_template-#{GovukTemplate::VERSION} into the pkg directory"
  task :mustache_inheritance => :compile do
    puts "Building pkg/mustache_inheritance_govuk_template-#{GovukTemplate::VERSION}"
    require 'packager/mustache_inheritance_packager'
    Packager::MustacheInheritancePackager.build
  end

  desc "Build jinja_govuk_template-#{GovukTemplate::VERSION} into the pkg directory"
  task :jinja => :compile do
    puts "Building pkg/jinja_govuk_template-#{GovukTemplate::VERSION}"
    require 'packager/jinja_packager'
    Packager::JinjaPackager.build
  end

  desc "Build ejs_govuk_template-#{GovukTemplate::VERSION} into the pkg directory"
  task :ejs => :compile do
    puts "Building pkg/ejs_govuk_template-#{GovukTemplate::VERSION}"
    require 'packager/ejs_packager'
    Packager::EJSPackager.build
  end
  
  desc "Build govuk_template-#{GovukTemplate::VERSION}.jar into the pkg directory"
  task :webjar => :compile do
    puts "Building pkg/govuk_template-#{GovukTemplate::VERSION}.jar"
    require 'packager/webjar_packager'
    Packager::WebJarPackager.build
  end

  desc "Build and release gem to gemfury if version has been updated"
  task :and_release_if_updated => :build do
    p = GemPublisher::Publisher.new('govuk_template.gemspec')
    if p.version_released?
      puts "govuk_template-#{GovukTemplate::VERSION} already released.  Not pushing."
    else
      puts "Pushing govuk_template-#{GovukTemplate::VERSION} to gemfury"
      p.pusher.push "pkg/govuk_template-#{GovukTemplate::VERSION}.gem", :rubygems
      p.git_remote.add_tag "v#{GovukTemplate::VERSION}"
      puts "Done."

      require 'publisher/docs_publisher'
      q = Publisher::DocsPublisher.new
      puts "Pushing docs #{GovukTemplate::VERSION} to git repo"
      q.publish
      puts "Done."
    end

    require 'publisher/release_publisher'
    q = Publisher::ReleasePublisher.new
    if q.version_released?
      puts "Github release v#{GovukTemplate::VERSION} already released. Not pushing."
    else
      puts "Pushing Github release v#{GovukTemplate::VERSION}"
      q.publish
    end

    require 'publisher/play_publisher'
    q = Publisher::PlayPublisher.new
    if q.version_released?
      puts "govuk_template_play #{GovukTemplate::VERSION} already released. Not pushing."
    else
      puts "Pushing govuk_template_play #{GovukTemplate::VERSION} to git repo"
      q.publish
    end

    require 'publisher/mustache_publisher'
    q = Publisher::MustachePublisher.new
    if q.version_released?
      puts "govuk_template_mustache #{GovukTemplate::VERSION} already released. Not pushing."
    else
      puts "Pushing govuk_template_mustache #{GovukTemplate::VERSION} to git repo"
      q.publish
    end

    require 'publisher/ejs_publisher'
    q = Publisher::EJSPublisher.new
    if q.version_released?
      puts "govuk_template_ejs #{GovukTemplate::VERSION} already released. Not pushing."
    else
      puts "Pushing govuk_template_ejs #{GovukTemplate::VERSION} to git repo"
      q.publish
    end
  end
end

require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new(:spec)


desc "Run integration tests against all languages/frameworks with an integration testing app"
task :integration_tests => ["integration_tests:test_html"]

namespace :integration_tests do
  desc "Clear the HTML rendered by each app"
  task :clean_html do
    FileUtils.rm Dir.glob('integration_tests/html_for_testing/*.html')
  end

  desc "Run the build.sh in each app to run its tests and generate the HTML for testing"
  task :build_all_test_integrations => [:build, :clean_html] do
    Dir["integration_tests/integrations/*"].each do |app_directory_name|
      # We need to run each app in isolation from our Bundler environment
      Bundler.with_clean_env do
        Dir.chdir(app_directory_name) do
          require "open3"
          _stdin, stdout, stderr, wait_thr = Open3.popen3("./build.sh")
          exit_status = wait_thr.value.to_i
          if exit_status != 0
            STDERR.puts "Running #{app_directory_name}/build.sh failed with exit status: #{exit_status}"
            STDERR.puts "stdout:"
            STDERR.puts stdout.read
            STDERR.puts "stderr:\n"
            STDERR.puts stderr.read
            fail # Make sure that we exit with non-zero
          end
        end
      end
    end
  end

  desc "Test HTML from each integration testing app"
  RSpec::Core::RakeTask.new(:test_html => :build_all_test_integrations) do |t|
    t.pattern = 'integration_tests/*_spec.rb'
  end
end

task :spec => :compile
task :default => :spec
