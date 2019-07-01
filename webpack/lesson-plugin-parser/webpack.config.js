const webpack = require('webpack');

class MyPlugin {
  apply(compiler) {}
}

module.exports = {
  devtool: 'source-map',
  entry: './index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
  },
  plugins: [new MyPlugin()],
};
