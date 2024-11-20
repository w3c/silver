require 'erb'
require_relative 'template_processor'

module Compiler
  class LiquidProcessor < TemplateProcessor

    def self.include_for(key)
      "{% include layouts/_#{key}.html %}"
    end

    @@yield_hash = {
      after_header:         include_for(:after_header),
      body_classes:         include_for(:body_classes),
      body_start:           include_for(:body_start),
      body_end:             include_for(:body), # Note that this differs from the key!
      content:              "{{ content }}",
      cookie_message:       include_for(:cookie_message),
      footer_support_links: include_for(:footer_support_links),
      footer_top:           include_for(:footer_top),
      homepage_url:         "{% if page.homepage_url %}{{ page.homepage_url }}{% else %}https://www.gov.uk/{% endif %}",
      global_header_text:   "{% if page.global_header_text %}{{ page.global_header_text }}{% endif %}",
      head:                 include_for(:head),
      header_class:         "{% if page.header_class %}{{ page.header_class }}{% endif %}",
      html_lang:            "{% if page.html_lang %}{{ page.html_lang }}{% else %}en{% endif %}",
      inside_header:        include_for(:inside_header),
      page_title:           include_for(:page_title),
      proposition_header:   include_for(:proposition_header),
      top_of_page:          include_for(:top_of_page),
      skip_link_message:    "{% if page.skip_link_message %}{{ page.skip_link_message }}{% else %}Skip to main content{% endif %}",
      logo_link_title:      "{% if page.logo_link_title %}{{ page.logo_link_title }}{% else %}Go to the GOV.UK homepage{% endif %}",
      licence_message:      include_for(:licence_message),
      crown_copyright_message: "{% if page.crown_copyright_message %}{{ page.crown_copyright_message }}{% else %}&copy; Crown copyright{% endif %}",
    }

    def handle_yield(section = :layout)
      @@yield_hash[section]
    end

    def asset_path(file, options={})
      return file if @is_stylesheet
      case File.extname(file)
      when '.css'
        "{{ site.govuk_template_assets }}/stylesheets/#{file}"
      when '.js'
        "{{ site.govuk_template_assets }}/javascripts/#{file}"
      else
        "{{ site.govuk_template_assets }}/images/#{file}"
      end
    end
  end
end
