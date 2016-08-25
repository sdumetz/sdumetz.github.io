---
title: inline SVG files with Jekyll.
---

I love jekyll. I think it's the right balance between providing good authoring and reusability tools and getting in the way of creativity with a bloated structure (looking at you, drupal!).

However while it's module ecosystem is growing, it still lacks some maturity. I've had some difficulties trying to integrate SVG icons in my static site and thought I would share my method here.

To get SVG icons in your website, you got some alternatives:

- font icons : deserve their [death warrant](https://speakerdeck.com/ninjanails/death-to-icon-fonts) **AND** complicated to make.
- use img tags (with SVG/PNG/JPG) : unstylable, lots of requests
- inline SVG.

The choice is difficult and need to be ponderated... Just kidding, let's embed SVG.

Here's a minimal code snippet that takes a svg, optimize it and inline it in your html. It lacks some polish, especially options support, but it works perfectly.

**Note** : Optimization is strictly optionnal, just drop the *svg_optimizer* require, remove the *Optimize()* call and you're free to go.

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
