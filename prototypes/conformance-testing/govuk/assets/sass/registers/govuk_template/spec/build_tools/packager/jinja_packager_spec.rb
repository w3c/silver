require 'spec_helper'
require File.join(PROJECT_ROOT, 'build_tools/compiler/asset_compiler.rb')
require File.join(PROJECT_ROOT, 'build_tools/packager/jinja_packager.rb')

describe Packager::JinjaPackager do
  let(:generated_directory_path) {File.join(PROJECT_ROOT, "pkg/jinja_govuk_template-#{GovukTemplate::VERSION}")}
  let(:generated_template_path) {File.join(generated_directory_path, "views/layouts/govuk_template.html")}
  subject {described_class.new}

  after do
    FileUtils.rm_rf(generated_directory_path)
  end

  context "functional" do
    describe "build" do

      it "should output the correct template" do
        subject.build

        generated_template = File.read(generated_template_path)
        expect(generated_template).to match(%r[\A{% block top_of_page %}{% endblock %}])
        expect(generated_template).to match(%r[href="{{ asset_path }}stylesheets/govuk-template\.css\?#{Regexp.escape(GovukTemplate::VERSION)}"])
      end

    end
  end

end
