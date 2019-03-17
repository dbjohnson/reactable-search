const path = require('path');

module.exports = {
  entry: "./demo/demo.jsx",
  output: {
    path: path.join(__dirname, "demo"),
    filename: "demo.js"
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/react', '@babel/env']
          }
        },
        exclude: /node_modules/,
      }
    ]
  }
};
