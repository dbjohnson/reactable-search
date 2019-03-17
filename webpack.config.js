var webpack = require("webpack");
const path = require('path');

module.exports = {
  entry: "./reactable-search.js",
  output: {
    path: path.join(__dirname, "dist"),
    libraryTarget: "commonjs2",
    filename: "reactable-search.js"
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"}
        ]
      },
      {
        test: /.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/react', '@babel/env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: 'url-loader?limit=100000'
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
       $: "jquery",
       jQuery: "jquery"
   }),
    new webpack.DefinePlugin({
      "process.env": {
         NODE_ENV: JSON.stringify("production")
       }
    })
  ]
};
