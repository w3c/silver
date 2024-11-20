require 'erb'
require_relative 'template_processor'

module Compiler
  class PlayProcessor < TemplateProcessor

    @@yield_hash = {
      layout: '<!-- Page content goes here -->',
      html_lang: '@htmlLang.getOrElse("en")',
      # NOTE: the mismatch between page_title and @title
      page_title: '@title.getOrElse("GOV.UK - The best place to find government services and information")',
      # top_of_page has a special purpose: it is required by Play to define the
      # parameters to pass when rendering
      # https://www.playframework.com/documentation/2.2.x/ScalaTemplates#Template-parameters
      top_of_page: '@(title: Option[String], bodyClasses: Option[String], htmlLang: Option[String] = None)(head:Html, bodyStart:Html, bodyEnd:Html, insideHeader:Html, afterHeader:Html, footerTop:Html, footerLinks:Html, headerClass:Html = Html.empty, propositionHeader:Html = Html.empty, homepageUrl:Html = Html.empty, globalHeaderText:Html = Html.empty, cookieMessage:Html = Html.empty, skipLinkMessage:Html, logoLinkTitle:Html, licenceMessage:Html, crownCopyrightMessage:Html)(content:Html)',
      head: '@head',
      body_classes: '@bodyClasses.getOrElse("")',
      header_class: '@headerClass',
      proposition_header: '@propositionHeader',
      content: '@content',
      body_start: '@bodyStart',
      body_end: '@bodyEnd',
      inside_header: '@insideHeader',
      after_header: '@afterHeader',
      footer_top: '@footerTop',
      footer_support_links: '@footerLinks',
      homepage_url: '@homepageUrl.getOrElse("https://www.gov.uk/")',
      global_header_text: '@globalHeaderText.getOrElse("GOV.UK")',
      cookie_message: '@cookieMessage.getOrElse(\'<p>GOV.UK uses cookies to make the site simpler. <a href="https://www.gov.uk/help/cookies">Find out more about cookies</a></p>\')',
      skip_link_message: '@skipLinkMessage.getOrElse("Skip to main content")',
      logo_link_title: '@logoLinkTitle.getOrElse("Go to the GOV.UK homepage")',
      licence_message: '@licenceMessage',
      crown_copyright_message: '@crownCopyrightMessage.getOrElse("&copy; Crown copyright")',
    }

    def render_erb
      f=File.read(@file)
      f.gsub!(/@-ms-viewport/, "@@-ms-viewport") unless @is_stylesheet
      ERB.new(f).result(binding)
    end

    def handle_yield(section = :layout)
      @@yield_hash[section]
    end

    def asset_path(file, options={})
      return file if @is_stylesheet
      case File.extname(file)
      when '.css'
        %Q{@routes.Template.at("stylesheets/#{file}")}
      when '.js'
        %Q{@routes.Template.at("javascripts/#{file}")}
      else
        %Q{@routes.Template.at("images/#{file}")}
      end
    end
  end
end
