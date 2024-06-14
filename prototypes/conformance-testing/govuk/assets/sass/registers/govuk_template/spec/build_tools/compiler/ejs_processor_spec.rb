require 'spec_helper'
require File.join(PROJECT_ROOT, 'build_tools/compiler/ejs_processor.rb')

def valid_sections
  {
    html_lang: "<% if (htmlLang) { %><%= htmlLang %><% } else { %>en<% } %>",
    page_title: "<%- partial('partials/_page_title') %>",
    head: "<%- partial('partials/_head') %>",
    body_classes: "<%= bodyClasses %>",
    content: "<%- partial('partials/_content') %>",
    body_end: "<%- partial('partials/_body_end') %>",
    footer_top: "<%- partial('partials/_footer_top') %>",
    footer_support_links: "<%- partial('partials/_footer_support_links') %>",
    inside_header: "<%- partial('partials/_inside_header') %>",
    proposition_header: "<%- partial('partials/_proposition_header') %>",
    cookie_message: "<%- partial('partials/_cookie_message') %>"
  }
end

describe Compiler::EJSProcessor do

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
          expect(subject.asset_path(css_asset_file)).to eql("<%= govukTemplateAssetPath %>stylesheets/#{css_asset_file}?#{GovukTemplate::VERSION}")
        end
      end
      context "if javascript file path passed in" do
        let(:js_asset_file) {"a/file.js"}
        #up for debate - whole project is js
        it "should return the correct path for a javascript file" do
          expect(subject.asset_path(js_asset_file)).to eql("<%= govukTemplateAssetPath %>javascripts/#{js_asset_file}?#{GovukTemplate::VERSION}")
        end
      end
      context "if other file path passed in" do
        let(:other_asset_file) {"a/file.png"}
        it "should return the correct path for an image" do
          expect(subject.asset_path(other_asset_file)).to eql("<%= govukTemplateAssetPath %>images/#{other_asset_file}?#{GovukTemplate::VERSION}")
        end
      end
    end
  end

end
