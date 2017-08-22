---
title: Plugins helpers for Jekyll
image: /data/posts/jekyll-plugins.png
---

I use [Jekyll](https://jekyllrb.com) a lot at work for various static sites. Throughout it, I've developped some handy [plugins](https://github.com/sdumetz/jekyll-inline-svg). While Jekyll's plugins system is easy and powerful to use, the doc lacks some info on helpers functions, right_way&#8482; to parse arguments, etc...
Here's a short list, half for myself to remember, half for others to learn.

## Class documentation

While [jekyll](https://jekyllrb.com) is great, developpers might like [rubydoc](http://www.rubydoc.info/gems/jekyll)'s page to get a complete Class reference on Jekyll's internals. The [Utils](http://www.rubydoc.info/gems/jekyll/Jekyll/Utils) class has some useful methods. Similarly, [Liquid](http://www.rubydoc.info/gems/liquid) gem's docs are not advertised in any of the mainstream sites. It reveals priceless when digging into templates internals.

The `Liquid` class has some useful constants, like `Liquid::QuotedFragment` which will match any quoted string

## Helper functions

### lookup_variable

`lookup_variable(name, context)` is the only export of [Jekyll::LiquidExtensions](https://github.com/jekyll/jekyll/blob/master/lib/jekyll/liquid_extensions.rb), and is a handy shortcut to interpret liquid variables at render time.

Here is the example code for a `Liquid::Tag` :

```
require 'jekyll/liquid_extensions'
module Jekyll
  module Tags
    class FooTag < Liquid::Tag
      include Jekyll::LiquidExtensions
      VARIABLE = /\{\{\s*([\w]+\.?[\w]*)\s*\}\}/i
      def initialize(tag_name, markup, tokens)
        super
        @markup = markup
      end

      def interpret(markup, context)
        markup.scan VARIABLE do |variable|
          markup = markup.gsub(VARIABLE, lookup_variable(context, variable.first))
        end
        markup
      end
      def render(context)
        parsed_markup = interpret(@markup,context)
        # actual code here
      end
    end
  end
end
```

It will replace anything enclosed in `{{}}` by it's variable value within context. If the variable does not exists, it outputs the variable's name.

### sanitized_path

Jekyll require you to "jail" paths to the site's source directory. `Jekyll.sanitized_path(base, file)` will effectively ensure this. Complete behaviour tests are available for review [here](https://github.com/jekyll/jekyll/blob/73419cb374be1b8f45818a23116cf71db93549ce/test/test_path_sanitization.rb). Practical usage inside your plugin will look like this :
```
def render(context)
  file_path = Jekyll.sanitized_path(context.registers[:site].source, interpret(@markup,context))
  # actual code here
end
```
Thus, `/foo.txt`, `foo.txt` will resolve relative to the site's source dir. Furthermore, `../foo.txt` and `/../foo.txt` will also work. I don't see why you'd do that but it's always good to have some layer of safety.

## Testing

Greatly inspired by work done by others on [jekyll-sitemap](https://github.com/jekyll/jekyll-sitemap).

### Integration testing

Always check your code actually does something out there in the wild. Fortunately, it's easy to do just that. Create a `fixture/` directory with the required files :

- \_layouts/default.html
- index.html
- any necessary file for test purposes

Then test (using rspec here. adapt to your framework of choice)

```
SOURCE_DIR = File.expand_path("../fixtures", __FILE__)
DEST_DIR   = File.expand_path("../dest",     __FILE__)

def source_dir(*files)
  File.join(SOURCE_DIR, *files)
end

def dest_dir(*files)
  File.join(DEST_DIR, *files)
end

describe "Integration" do
  before(:context) do
    config = Jekyll.configuration({
      "source"      => source_dir,
      "destination" => dest_dir,
      "url"         => "http://example.org",
    })
    site = Jekyll::Site.new(config)
    site.process
  end
  it "render site" do
    expect(File.exist?(dest_dir("index.html"))).to be_truthy
  end
end
```

Then add test cases to verify if output is *as expected*.
