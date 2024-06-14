require 'govuk_template/version'
require 'octokit'

module Publisher
  class ReleasePublisher
    GITHUB_REPO = 'alphagov/govuk_template'

    def initialize(version = GovukTemplate::VERSION)
      @version = version
      @pkg_dir = Pathname.new(File.expand_path('../../..', __FILE__)).join('pkg')
      @github_client = Octokit::Client.new(access_token: ENV['GITHUB_TOKEN'])
    end

    def publish
      release = @github_client.create_release(GITHUB_REPO, "v#{@version}", name: "Version #{@version}")
      Dir["#{@pkg_dir}/*#{@version}.tgz"].each do |tarball|
        puts "- Uploading #{tarball} to github release"
        @github_client.upload_asset(release[:url], tarball)
      end
    end

    def version_released?
      releases = @github_client.releases(GITHUB_REPO)
      tag_versions = releases.map { |release| release[:tag_name] }
      return tag_versions.include?("v#{@version}")
    end
  end
end
