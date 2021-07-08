class UsesOfYieldInTemplate
  def initialize(filename)
    @filename = filename
  end

  def call
    uses_of_yield = []
    # The block supplied to render_erb is invoked every time yield is called in
    # the template. This happens via the `binding`.
    render_erb do |section|
      uses_of_yield << section
    end
    uses_of_yield.uniq
  end

  def render_erb
    ERB.new(File.read(@filename)).result(binding)
  end

  def raw(html)
  end

  def content_for?(*args)
    # content_for is used to decide whether to call `yield :argument`.
    # We always want yield to get called so that we can record the arguments passed
    true
  end

  def asset_path(*args)
  end

  def method_missing(name, *args)
    puts "#{name} #{args.inspect}"
  end
end

# return an array of unique values passed to yield in the templates
def uses_of_yield_in_templates
  path_to_templates = "#{PROJECT_ROOT}/app/**/*.erb"
  templates = Dir.glob(path_to_templates)

  templates.reduce([]) do |accumulator, filename|
    accumulator | UsesOfYieldInTemplate.new(filename).call
  end
end
