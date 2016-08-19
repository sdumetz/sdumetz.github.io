---
title: inline SVG files with Jekyll.
---


{% highlight ruby %}
require 'svg_optimizer'

class RemoveSize < SvgOptimizer::Plugins::Base
  def process

    xml.root.remove_attribute("height")
    xml.root.set_attribute("width","!!WIDTH!!")
  end
end

module Jekyll
  class RenderSvg < Liquid::Tag

    def initialize(tag_name, input, tokens)
      super
      params = split_params(input)
      @svg = params[0][0..params[0].rindex(" ")].strip
      size = /size=(\d*)/.match(input)
      if size && size[1]
        @width=size[1]
      else
        @width=24
      end

    end

    def split_params(params)
      params.split("=")
    end
    def render(context)
      svg_file = File.join(context.registers[ :site ].source, @svg)
      xml = File.open(svg_file, "rb")
      optimized = SvgOptimizer.optimize(xml.read, SvgOptimizer::DEFAULT_PLUGINS + [RemoveSize])
	    "#{optimized.gsub("!!WIDTH!!","#{@width}px")}"
    end
  end
end

Liquid::Template.register_tag('svg', Jekyll::RenderSvg)
{% endhighlight %}
