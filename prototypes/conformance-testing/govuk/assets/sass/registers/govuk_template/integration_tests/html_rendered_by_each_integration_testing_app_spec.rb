require 'spec_helper'
require 'rspec-html-matchers'

def rendered_html_files
  Dir.glob("#{PROJECT_ROOT}/integration_tests/html_for_testing/*.html")
end

describe "HTML rendered by each integration testing app" do
  include RSpecHtmlMatchers

  rendered_html_files.each do |filename|
    describe "#{filename}" do
      subject { File.open(filename).read }

      it "should allow overriding the lang attribute on the html tag" do
        expect(subject).to have_tag("html", with: { lang: 'rb' })
      end

      it "should allow overriding the page title" do
        expect(subject).to have_tag("title", text: "This is a custom page title")
      end

      it "should allows inserting content into the head" do
        expect(subject).to have_tag("head") do
          with_tag "inserted-into-head"
        end
      end

      it "should allow setting_body_classes" do
        expect(subject).to have_tag("body", with: { class: "custom_body_class" })
      end

      it "should allow inserting content into body_start" do
        expect(subject).to have_tag("body") do
          with_tag "inserted-into-body-start"
        end
      end

      it "should allow overriding the cookie message" do
        expect(subject).to have_tag("div#global-cookie-message", text: /Custom cookie message/)
      end

      it "should allow setting_global_header_class" do
        expect(subject).to have_tag("header", with: { class: "custom_header_class" })
      end

      it "should allow inserting content into the header" do
        expect(subject).to have_tag("header") do
          with_tag("inside-header")
        end
      end

      it "should allow inserting_a_proposition_header" do
        expect(subject).to have_tag("header") do
          with_tag("proposition-header")
        end
      end

      it "should allow inserting_after_header" do
        expect(subject).to have_tag("body") do
          with_tag("after-header")
        end
      end

      it "should content" do
        expect(subject).to have_tag("body", text: /The page content/)
      end

      it "should footer_top" do
        expect(subject).to have_tag("footer") do
          with_tag "footer-top"
        end
      end

      it "should footer_support_links" do
        expect(subject).to have_tag("footer") do
          with_tag "footer-support-links"
        end
      end

      it "should body_end" do
        expect(subject).to have_tag("body") do
          with_tag "body-end"
        end
      end

      it "should support a skip_link_message" do
        expect(subject).to have_tag("#skiplink-container", text: "Custom skip link text")
      end

      it "should support a logo_link_title" do
        expect(subject).to have_tag(".header-logo a", with: { title: "Custom logo link title text" })
      end

      it "should support a licence_message" do
        expect(subject).to have_tag(".open-government-licence", text: /Custom license message text/)
      end

      it "should support a crown_copyright_message" do
        expect(subject).to have_tag(".copyright", text: "Custom crown copyright message text")
      end
    end
  end
end
