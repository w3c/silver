require 'spec_helper'
require File.join(PROJECT_ROOT, 'build_tools/compiler/mustache_processor.rb')

def valid_sections
  {
    html_lang: "{{ htmlLang }}",
    page_title: "{{ pageTitle }}",
    head: "{{{ head }}}",
    body_classes: "{{ bodyClasses }}",
    content: "{{{ content }}}",
    body_end: "{{{ bodyEnd }}}",
    top_of_page: "{{{ topOfPage }}}",
    footer_top: "{{{ footerTop }}}",
    footer_support_links: "{{{ footerSupportLinks }}}",
    inside_header: "{{{ insideHeader }}}",
    proposition_header: "{{{ propositionHeader }}}",
    cookie_message: "{{{ cookieMessage }}}"
  }
end

describe Compiler::MustacheProcessor do

  let(:file) {"some/file.erb"}
  subject {described_class.new(file)}


  describe "#handle_yield" do
    valid_sections.each do |key, content|
      it "should render #{content} for #{key}" do
        expect(subject.handle_yield(key)).to eql(content)
      end
    end
  end

  describe "#asset_path" do
    context "if file is stylesheet" do
      let(:asset_file) {"a/file.css"}
      before do
        subject.instance_variable_set(:@is_stylesheet, true)
      end
      it "should return the file" do
        expect(subject.asset_path(asset_file)).to eql("#{asset_file}?#{GovukTemplate::VERSION}")
      end
    end
    context "if not stylesheet" do
      context "if css file path passed in" do
        let(:css_asset_file) {"a/file.css"}
        it "should return the correct path for a stylesheet" do
          expect(subject.asset_path(css_asset_file)).to eql("{{{ assetPath }}}stylesheets/#{css_asset_file}?#{GovukTemplate::VERSION}")
        end
      end
      context "if javascript file path passed in" do
        let(:js_asset_file) {"a/file.js"}
        #up for debate - whole project is js
        it "should return the correct path for a javascript file" do
          expect(subject.asset_path(js_asset_file)).to eql("{{{ assetPath }}}javascripts/#{js_asset_file}?#{GovukTemplate::VERSION}")
        end
      end
      context "if other file path passed in" do
        let(:other_asset_file) {"a/file.png"}
        it "should return the correct path for an image" do
          expect(subject.asset_path(other_asset_file)).to eql("{{{ assetPath }}}images/#{other_asset_file}?#{GovukTemplate::VERSION}")
        end
      end
    end
  end

end
