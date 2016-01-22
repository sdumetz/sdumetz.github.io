//As in https://github.com/google/traceur-compiler/issues/563 to use for..of on non-array objects before it's merged.
var pseudoArrays = [
  Object,
  String,
  NamedNodeMap,
  NodeList,
  HTMLCollection,
  CSSStyleDeclaration,
  FileList
];

pseudoArrays.forEach( function(pseudoArray) {
  var prototype = pseudoArray.prototype;
  console.log(prototype)
  Object.defineProperty(prototype, Symbol.iterator, {
    configurable: true,
    enumerable: false,
    writable: true,

    value: function() {
      var index = 0;
      var array = this;
      return {
        next: function() {
          if (index < array.length) {
            return {value: array[index++], done: false};
          }
          return {value: undefined, done: true};
        }
      };
    },
  });
});
