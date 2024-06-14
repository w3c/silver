require 'spec_helper'
require 'erb'

describe "stylesheets" do
  describe "compiled stylesheets assets" do
    def asset_path(file, options = {})
      asset_file = repo_root.join("app/assets/stylesheets/#{file}")
      expect(asset_file).to be_file, "asset #{file} not found under app/assets/stylesheets"
      file
    end

    FilesHelper.manifests["stylesheets"].each do |stylesheet|
      it "#{stylesheet}.css.erb should reference assets that exist in the stylesheets directory" do
        file = repo_root.join("app/assets/stylesheets/#{stylesheet}.css.erb")
        expect(file).to be_file, "could not find stylesheet #{stylesheet} referenced in manifests.yml"

        ERB.new(file.read).result(binding) # triggers calls to asset_path above
      end
    end
  end
end
