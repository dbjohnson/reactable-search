module.exports = {
  entry: "./demo/demo.jsx",
  output: {
    path: "./demo",
    filename: "demo.js"
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          plugins: ["transform-runtime"],
          presets: ["es2015", "react"]
        }
      }
    ]
  }
};
