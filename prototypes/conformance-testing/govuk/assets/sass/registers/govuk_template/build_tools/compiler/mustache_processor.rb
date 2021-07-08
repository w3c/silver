require 'erb'
require_relative 'template_processor'

module Compiler
  class MustacheProcessor < TemplateProcessor

    def self.tag_for(lowerCamelCaseKey)
      "{{ #{lowerCamelCaseKey} }}"
    end

    def self.unescaped_html_tag_for(lowerCamelCaseKey)
      "{{{ #{lowerCamelCaseKey} }}}"
    end

    @@yield_hash = {
      after_header:         unescaped_html_tag_for(:afterHeader),
      body_classes:         tag_for(:bodyClasses),
      body_start:           unescaped_html_tag_for(:bodyStart),
      body_end:             unescaped_html_tag_for(:bodyEnd),
      content:              unescaped_html_tag_for(:content),
      cookie_message:       unescaped_html_tag_for(:cookieMessage),
      footer_support_links: unescaped_html_tag_for(:footerSupportLinks),
      footer_top:           unescaped_html_tag_for(:footerTop),
      homepage_url:         unescaped_html_tag_for(:homepageUrl),
      global_header_text:   unescaped_html_tag_for(:globalHeaderText),
      head:                 unescaped_html_tag_for(:head),
      header_class:         unescaped_html_tag_for(:headerClass),
      html_lang:            tag_for(:htmlLang),
      inside_header:        unescaped_html_tag_for(:insideHeader),
      page_title:           tag_for(:pageTitle),
      proposition_header:   unescaped_html_tag_for(:propositionHeader),
      top_of_page:          unescaped_html_tag_for(:topOfPage),
      skip_link_message:    tag_for(:skipLinkMessage),
      logo_link_title:      tag_for(:logoLinkTitle),
      licence_message:      unescaped_html_tag_for(:licenceMessage),
      crown_copyright_message: tag_for(:crownCopyrightMessage),
    }

    def handle_yield(section = :layout)
      @@yield_hash[section]
    end

    def asset_path(file, options={})
      query_string = GovukTemplate::VERSION
      return "#{file}?#{query_string}" if @is_stylesheet
      case File.extname(file)
      when '.css'
        "{{{ assetPath }}}stylesheets/#{file}?#{query_string}"
      when '.js'
        "{{{ assetPath }}}javascripts/#{file}?#{query_string}"
      else
        "{{{ assetPath }}}images/#{file}?#{query_string}"
      end
    end
  end
end
