const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');

const dev = (process.env.NODE_ENV = 'development');

module.exports = {
  entry: [
    ...(dev ? ['react-hot-loader/patch', 'webpack-hot-middleware/client'] : []),
    './client.js',
  ],
  mode: 'development',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    ...(dev ? [new webpack.HotModuleReplacementPlugin()] : []),
    new FriendlyErrorsWebpackPlugin(),
    new ReactLoadablePlugin({
      filename: './dist/react-loadable.json',
    }),
  ],
  resolve: {
    alias: {
      ...(dev ? { 'react-dom': '@hot-loader/react-dom' } : {}),
    },
  },
};
