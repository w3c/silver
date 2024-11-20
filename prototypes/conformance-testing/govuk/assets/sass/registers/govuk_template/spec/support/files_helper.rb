require 'yaml'

module FilesHelper
  def repo_root
    @repo_root ||= Pathname.new(File.expand_path('../../..', __FILE__))
  end

  def manifests
    @manifests ||= YAML.load_file(repo_root.join('manifests.yml'))
  end
  module_function :manifests, :repo_root
end

RSpec.configuration.include FilesHelper
