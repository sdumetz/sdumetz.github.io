# sdumetz.github.io

This is an exploration of the newest (as of Jan. 2016) web technologies. It provides the polyfills to run on chrome/firefox stable but is by no mean designed for a wide browser compatibility.

Think of it as a "what would vanilla web development look like in 2 years" experiment. Thus it's really lightweight on the client side as well as on the developper side (no npm-install a petabyte of helpers)...

Currently used new features :
- JS
  - classes (chrome 42, gg 45, MS Edge 13, Safari 9.0)
  - imports (Not Supported)
  - arrow functions (chrome 45, Firefox 22, opera 32)
  - for...of (firefox 13, MS Edge 12 Opera 25 Safari 7.1)
- HTML
  - imports (easily polyfilled. Not important.)


## TODO

- structural
  - Replace font-icons by inline svg. [because it's not-so-good](http://blog.cloudfour.com/seriously-dont-use-icon-fonts/).
  - Optimize Images : resolution, quality and compression
- code
  - optimize ElementList.update
