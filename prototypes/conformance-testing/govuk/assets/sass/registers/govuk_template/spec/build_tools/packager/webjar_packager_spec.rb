require 'spec_helper'
require File.join(PROJECT_ROOT, 'build_tools/compiler/asset_compiler.rb')
require File.join(PROJECT_ROOT, 'build_tools/packager/webjar_packager.rb')

describe Packager::WebJarPackager do
  let(:generated_jar) {File.join(PROJECT_ROOT, "pkg/govuk_template-#{GovukTemplate::VERSION}.jar")}
  subject {described_class.new}

  after do
    FileUtils.rm_rf(generated_jar)
  end

  context "functional" do
    describe "build" do
      it "should output the correct template files" do
        subject.build
        
        output, status = Open3.capture2e("jar -tvf #{generated_jar} | grep META-INF/resources/webjars/govuk_template/#{GovukTemplate::VERSION}/stylesheets/govuk-template.css")
        expect(status.exitstatus).to eql(0)
        
        output, status = Open3.capture2e("jar -tvf #{generated_jar} | grep META-INF/resources/webjars/govuk_template/#{GovukTemplate::VERSION}/images/opengraph-image.png")
        expect(status.exitstatus).to eql(0)
      end
    end
  end
end
