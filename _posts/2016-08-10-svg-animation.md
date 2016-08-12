---
title: Animate a SVG with motion-path
---

One of the big wins of svg for the web is animation. It's not as important now that we have canvas that works for nearly everything, but there is one thing really easy with SVGs and a real pain with canvas : Moving an object along a path.

However the canonical way to do it is with [SMIL](https://www.w3.org/AudioVideo/), which is in the way of being deprecated ([Chrome](https://www.chromestatus.com/feature/5371475380928512) leading the way). So how do we do this wib web animations?

## Enter "motion-path"

The `motion-path` css property is quite powerful while ill documented for now. I could not find any complete pure-css usage example. [MDN](https://developer.mozilla.org/fr/docs/Web/CSS/motion-path) only show a basic example which requires javascript. The main reason for this lack of documentation? Only chrome support it for now.

## Making an animated earth globe

### The SVG

Let's get the source for our earth : This excellent world map from [wikipedia](http://upload.wikimedia.org/wikipedia/commons/6/6f/World_Map.svg) was the best I could find.
<center>
<img align="center" class="img-responsive" src="http://upload.wikimedia.org/wikipedia/commons/6/6f/World_Map.svg" alt="svg world map"/>
<div>(Licensed under Creative-common v1.0)</div>
</center>
We will modify it a bit to be usable. Modified file available [here](/data/img/world.svg). we can now create a "world" with an xlink to `world.svg`.

From this base map, create a SVG embedded in your html (inclusion from `<img src="">` wont work). We will use a circle as `cliPath` to hide overflow. then just create 2 iterations on the world map for the front image, and 2 for the back. We duplicate the map to be able to rotate the world at least 360°.

{% highlight html %}
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"  viewBox="0 0 400 205" >
  <clipPath id="globe-shape"><circle  fill="#000000" opacity="1" cx="50%" cy="50%" r="102.5"/></clipPath>
  <g clip-path="url(#globe-shape)">
    <g class="continents" id="back">
       <use  xlink:href="img/world.svg#continents" x="-650" y="0" transform="scale(-1,1) "/>
       <use  xlink:href="img/world.svg#continents" x="-1123" y="0" transform="scale(-1,1) "/>
     </g>
    <g class="continents" id="front" >
     <use xlink:href="img/world.svg#continents" x="0" y="0"/>
     <use xlink:href="img/world.svg#continents" x="473" y="0"/>
   </g>
  </g>
</svg>
{% endhighlight %}

it's just plain old SVG and well documented on the web. The difficult part would have been to create the actual map, had wikipedia not been here.

### The CSS

I had to experiment a bit. Every tutorial I could find used Javascript  (like [this one](https://googlechrome.github.io/samples/css-motion-path/)), but in the end the API revealed itself to be quite simple and intuitive to use.
Here is the pure CSS raw code for the previous svg animation :

{% highlight css %}
    @keyframes movement {
      from{
        motion-offset: 0%;
      }
      to{
        motion-offset: 100%;
      }
    }
    @keyframes reverse_movement {
      from{
        motion-offset: 100%;
      }
      to{
        motion-offset: 0%;
      }
    }
    .continents{
      fill:#2fafe6;
      motion-path: path("M-473 0 L0 0");
      animation: movement 4s alternate infinite ease-in-out;
    }
    #back{
      opacity:0.2;
      animation-name: reverse_movement;
    }
{% endhighlight %}
we just put a motion-path from and to 473px. `motion-offset` will move the animation from 0 to 100% of the given path.
Here it's just a simple straight line and a `translate` would have worked. However you can achieve truly amazing effects with the motion-path feature. Here is for example a [magnetic field simulation](https://github.com/holusion/werner).

## A note on polyfills

the [web-animation](https://github.com/web-animations/web-animations-js) polyfill [plans](https://github.com/web-animations/web-animations-js/blob/master/docs/experimental.md) to support the feature. while `.animate()` is polyfilled, motion-path is not yet supported.

For this reason it's still a bit early to use `motion-path` in real world apps. Furthermore, the spec is still a **Working Draft** and a lot could change in the near future.
