module Packager
  class GemPackager
    def self.build
      new.build
    end

    def initialize
      @repo_root = Pathname.new(File.expand_path('../../..', __FILE__))
    end

    def build
      Dir.chdir @repo_root do
        gem = GemPublisher::Builder.new.build('govuk_template.gemspec')

        @repo_root.join('pkg').mkpath
        FileUtils.mv(gem, "pkg")
      end
    end
  end
end
