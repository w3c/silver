require 'spec_helper'

# require all the compilers so that they are present in ObjectSpace
Dir["#{PROJECT_ROOT}/build_tools/compiler/*.rb"].each {|file| require file }
def compiler_classes
  return_value = ObjectSpace.each_object(Class).select do |klass|
    klass < Compiler::TemplateProcessor
  end
  return_value.reject { |klass| klass == Compiler::PlainProcessor }
end

describe "compiler_classes test helper method" do
  it "should return more than 1 class" do
    expect(compiler_classes.size).to be > 1
  end
end

describe "Behaviours all compilers must support every value that gets yielded in the templates" do
  compiler_classes.each do |compiler_class|
    describe compiler_class do
      subject { compiler_class.new("dummy filename") }

      uses_of_yield_in_templates.each do |section|
        it "should support #{section} key" do
          expect(subject.handle_yield(section)).not_to be_nil
        end
      end
    end
  end
end
