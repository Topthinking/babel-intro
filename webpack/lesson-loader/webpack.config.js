const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const TestPlugin = require('./plugins/test');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jpg/,
        loader: 'ignoreCompiler-loader?a=2!filename-loader!file-loader',
      },
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `b.css`,
    }),
    new FriendlyErrorsWebpackPlugin(),
    new TestPlugin(),
  ],
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, 'loaders')],
  },
  devServer: {
    logLevel: 'silent',
    open: true,
    port: 8080,
  },
};
