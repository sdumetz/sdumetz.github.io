---
title: Using Webworkers with Webpack
---

I started using web workers for real-worl loads a few weeks ago and like many before me, I found it to be quite easy to use, but a real pain to debug. I'll gather my thought about them for later use.

The work was pretty simple :

- some static assets to always cache upfront
- A few API routes I wanted to cache "if possible".

However, as often with shiny new stuff, documentation can be hard to find.

## Setup

webworkers don't have access to  *exactly* the same runtime as normal scripts. Namely, all `window` methods and properties are missing. For this reason, webpack's normal build entries won't work as webservices.
Fortunately, webpack provides a **webworker** target. One would need 2 config objects to generate basic modules + a web worker :

{% highlight js %}
const config = {
  target: "web", //default
  entry:"main.js"
}
const wsConfig = {
  target:"webworker",
  entry:"sw.js"
}
module.exports = [config, wsConfig];
{% endhighlight %}

It took me longer than i'd like to admit to figure this one out, but it's dead simple and works like a charm. It's even, documented in the shiny new [webpack 2 doc](https://webpack.js.org/configuration/target/).

However, I could not make it work with **hot-reload**. I simply disabled hotReplacementPlugin() from my swConfig. It means my page won't reload automatically when I change `sw.js`.

Another option, which I finally came to use, is the [sw-precache-webpack-plugin](https://www.npmjs.com/package/sw-precache-webpack-plugin), which is just a wrapper around [sw-precache](https://www.npmjs.com/package/sw-precache). It takes your static files and generates a service file with them.

The service is slightly larger this way, but it save a lot of time and (more importantly), allows readable strategy handles depending on file names.

## Update

One main trouble you have, starting a web worker is man,aging updates : You want cache to be invalidated **EVERY TIME** it should, but your clients should be able work offline for months (okay, hours...) without trouble.

The first trick is to enable `clientsClaim:true` in sw-precache, or call `self.clients.claim()` in your worker if you can. It's not a one-stop-fit-all feature, so read [the doc](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim).

The other quick-start improvement is to have a good "install" step. Google's [introduction](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) example doesn't handle errors and that caused me some trouble :

{% highlight js %}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
{% endhighlight %}

It's not able to cleanly handle `update` events.

I found the registration example from [swPrecache](https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js) to be quite complete :

{% highlight js %}
if ('serviceWorker' in navigator) {
  // Your service-worker.js *must* be located at the top-level directory relative to your site.
  // It won't be able to control pages unless it's located at the same level or higher than them.
  // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
  // See https://github.com/slightlyoff/ServiceWorker/issues/468
  navigator.serviceWorker.register('service-worker.js').then(function(reg) {
    // updatefound is fired if service-worker.js changes.
    reg.onupdatefound = function() {
      // The updatefound event implies that reg.installing is set; see
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
      var installingWorker = reg.installing;

      installingWorker.onstatechange = function() {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and the fresh content will
              // have been added to the cache.
              // It's the perfect time to display a "New content is available; please refresh."
              // message in the page's interface.
              console.log('New or updated content is available.');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              console.log('Content is now available offline!');
            }
            break;

          case 'redundant':
            console.error('The installing service worker became redundant.');
            break;
        }
      };
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}
{% endhighlight %}

Still not perfect, but it at least clearly says when cache have been updated. If it have not, you know where the trouble is.

## cache control

At the end of the day, the only reliable way to achieve good cache control is to uniquely name your scripts so they can not be mistaken.

The sweetness here is either nothing have been updated, and you still have your full old app working (cheers!), or the `<html>` is new, and it's script are named differently, and everything is loaded anew. There's no annoying middle ground.

Creating uniquely named scripts with webpack is easy :
{% highlight js %}
filename: '[name].[hash].js'
{% endhighlight %}
*there is also a `chunkhash` variable which is unique to each chunk. hash however is shared*

The easy way to use it is to just output your HTML as static files from webpack on each rebuild.

When you can not, because of some dumb dynamic content you decided to add in it (you fool, it's so 2000's!), you can make webpack output a `stats.json` at build time, and read it from your server.

{% highlight js %}
// In webpack.config.js
const fs = require("fs");
config.plugins.push(function() {
  this.plugin("emit", function(stats,callback) {
    fs.writeFile(
      path.resolve(__dirname, "static/build", "stats.json"),
      JSON.stringify(stats.hash),callback);
  });
});
{% endhighlight js %}

Then you require your file as `const hash = "."+require(./static/build/stats.json)` or whatever your path is.

Now you can output html dynamically, using the build's script names.

{% highlight html %}
<!-- in  handlebars template -->
<script src="/static/build/bundle{{hash}}.js"
{% endhighlight %}

if you use a different temlplate engine, well... it's not like it's difficult to port, is it?

*and how will it work in development?*

For the development part, I modified a bit my webpack config :

{% highlight js %}
//webpack.config.js
const isProduction = process.env.NODE_ENV === 'production';
//Later in file
filename: isProduction?'[name].[hash].js':'[name].js',
{% endhighlight %}

Then in my server, I just have to set `hash = "";` in development
