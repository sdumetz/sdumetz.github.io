# sdumetz.github.io

This is an exploration of the newest (as of Jan. 2016) web technologies. It provides the polyfills to run on chrome/firefox stable but is by no mean designed for a wide browser compatibility.

Think of it as a "what would vanilla web development look like in 2 years" experiment. Thus it's really lightweight on the client side as well as on the server side (no npm-install a petabyte of helpers)...

... Except of it needs 2Mb of libraries to work on any widely used browser as of 01/2016.

Currently used bleeding edge features :
- JS
  - classes (chrome 42, gg 45, MS Edge 13, Safari 9.0)
  - imports (Not Supported)
  - arrow functions (chrome 45, Firefox 22, opera 32)
  - for...of (firefox 13, MS Edge 12 Opera 25 Safari 7.1)
- HTML
  - imports (easily polyfilled. Not important.)


## TODO

rebuild webcomponents to only have the html import polyfill
