require 'spec_helper'
require File.join(PROJECT_ROOT, 'build_tools/compiler/play_processor.rb')

# my_param_name => myParamName
def make_lower_camel_case(snake_case)
  snake_case.gsub(/(_.)/) do |underscore_first_letter|
    underscore_first_letter.sub('_', '').upcase
  end
end

def expected_parameter_names
  parameter_names = uses_of_yield_in_templates.map do |use_of_yield|
    make_lower_camel_case(use_of_yield.to_s)
  end

  # Ignore the parameter being used to insert the parameter declaration
  parameter_names.delete("topOfPage")

  if parameter_names.include?("pageTitle")
    # Account for an inconsistency in the name used in the ERB template and
    # the Play compiler/template
    parameter_names.delete("pageTitle")
    parameter_names << "title"
  end

  if parameter_names.include?("footerSupportLinks")
    parameter_names.delete("footerSupportLinks")
    parameter_names << "footerLinks"
  end

  parameter_names
end

describe Compiler::PlayProcessor do
  subject { described_class.new("dummy filename") }

  describe "top_of_page" do
    it "declares all of the template parameters" do
      expected_parameter_names.each do |parameter_name|
        expect(subject.handle_yield(:top_of_page)).to include(parameter_name)
      end
    end
  end
end
