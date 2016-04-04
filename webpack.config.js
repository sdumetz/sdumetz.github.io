module.exports = {
  entry: "./lib/index.js",
  devtool: 'source-map',
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module:{
    loaders: [
      {
        test: /^(?!.*(bower_components|node_modules))+.+\.js$/,
        loader: 'traceur?runtime&symbols'
      }
    ]
  }

}
