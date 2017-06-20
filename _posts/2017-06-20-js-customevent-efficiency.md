---
title: JS CustomEvent efficiency
image: /data/posts/customEvents/header.png
---

CustomEvent in browser-JS is a rarely used feature, while it's ubiquitous in it's server-side counterpart. It looks like an elegant solution to dispatch state changes, redux-style.

Let's see the good in this undervaluated feature

## Browser support

Good ol' [caniuse](https://caniuse.com/#feat=CustomEvent) is positive :

<script async src="//cdn.jsdelivr.net/caniuse-embed/1.1.0/caniuse-embed.min.js"></script>
<p class="ciu_embed" data-feature="customevent" data-periods="current,past_1,past_2">
  <a href="http://caniuse.com/#feat=customevent">Can I Use customevent?</a> Data on support for the customevent feature across the major browsers from caniuse.com.
</p>

We'll need a *IE 11* polyfill, which is fortunately simple enough (from [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill)):

{%highlight javascript %}
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
{% endhighlight %}

## Usage

We can easily make helper functions like this :
{%highlight javascript %}
function dispatchFoo(detail){
  document.dispatchEvent(new CustomEvent("foo",{detail:detail}));
}

function listenFoo(fn){
  document.addEventListener("foo",fn);
  return document.removeEventListener.bind(document,"foo",fn);
}
{% endhighlight %}

The listener can unsubscribe itself as it should. It lacks things like a `listenOnce()` shortcut, but that should be straightforward to implement as needed.

## Performance

All's well, but how fast is it?

The main drawback we read about over the web is the performance penalty of using too much event listeners in your app. However here, we're not setting loads of handlers all over the place. It's only using the `document` element. That change things...

We'll be testing 3 cases on 10000 iterations each. (complete code [here](/data/posts/customEvents/index.html))

#### Case 1

All events are registered on `document` global element. 10000 listeners are called when an event is dispatched.

#### Case 2

10000 DOM nodes are created. Each one gets an element attached. We dispatch 10000 events and each listener gets its own.


### Results

|type             | registration  | dispatch  | unsubscribe |
|global listener  |    135ms      |  17ms     |   28ms      |
|multi listeners  |    13ms       |  62ms     |   8ms       |

Of course it's hard to get a good measurement on a real world use case (3-4 listeners) because it's sub-millisecond...

Overall, those results are great. Why so much hate over this function? It comes from a bad practice that frameworks like React and other **Shadow DOM** based projects tries to solve.

### Repaints

Each time something in the DOM that would change appearance is modified, the browser performs a `repaint` (it's more of a cascade of operations, but let's keep it simple).

Except... not really.

To be efficient, the browser does not repaint until *enough* time has elapsed OR it's queried for some DOM property and need to recalculate.

| Operation            | time |
| update       (x1000) | 4ms  |
| query+update (x1000) | 472ms|

**Ouch.**

What does it means for our little listener? If it does **ANY** DOM query, it's going to take ~30ms to complete (depending on page's complexity).

### Conclusion

the `CustomEvent` mechanism is a great way to propagate, well, events... through your app. However, as always with vanilla JS, it's easy to hurt performance greatly with no apparent reason.
