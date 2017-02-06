---
title: make svg components in vanilla JS
---

As someone who essentially makes small or micro webapps, I find it best to use vanilla JS with some home made sugar.
For example, I often use some sort of barebone component system based on functions, like `h1("Hello World")`.
It's lightweight enough while leveraging best practices from the newest js frameworks. You can make a pretty complete library of functions from  in a few lines of code. However, what I find most useful in this workflow is the ability to add functionalities as you go. For example, here is how I made a **svg icon** function.

# SVG icon in javascript

Creating a SVG in pure JS is... a bit strange. Like, did you know `document.createElementNS()` was even a thing?

{% highlight js %}
var xmlns = "http://www.w3.org/2000/svg";
//Create SVG element
var svg = document.createElementNS(xmlns,"svg");
svg.setAttributeNS (null, "viewBox", `0 0 24 24`);
svg.setAttributeNS (null, "width",24);
svg.setAttributeNS (null, "height", 24);
var path = document.createElementNS(xmlns,"path");
// ...
svg.appendChild(path);
{% endhighlight %}

could I just write :

{% highlight js %}
svg(path({d:"M0,0  L2, 0 L2, 2 L0, 2"}))
{% endhighlight %}

I can? Great.

Let's shamelessly steal the code from [David Gilbertson](https://hackernoon.com/how-i-converted-my-react-app-to-vanillajs-and-whether-or-not-it-was-a-terrible-idea-4b14b1b2faff#.onfdc4uu1) and create a new `makeSVG()` function :
{% highlight js %}

function makeSVG(type, textOrPropsOrChild, ...otherChildren) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", type);
  if (Array.isArray(textOrPropsOrChild)) {
    appendArray(el, textOrPropsOrChild);
  } else if (textOrPropsOrChild instanceof window.Element) {
    el.appendChild(textOrPropsOrChild);
  } else if (typeof textOrPropsOrChild === `string`) {
    appendText(el, textOrPropsOrChild);
  } else if (typeof textOrPropsOrChild === `object`) {
    Object.keys(textOrPropsOrChild).forEach((propName) => {
      if (propName in el || attributeExceptions.includes(propName)) {
        const value = textOrPropsOrChild[propName];

        if (propName === `style`) {
          setStyles(el, value);
        } else if (value) {
          el[propName] = value;
        }
      } else {
        console.warn(`${propName} is not a valid property of a <${type}>`);
      }
    });
  }

  if (otherChildren) appendArray(el, otherChildren);

  return el;
}

const svg = (...args) => makeSVG(`svg`, ...args);
const path = (...args) => makeElement(`path`, ...args);
{% endhighlight %}
