const webpack = require('webpack');
const chalk = require('chalk');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

let time = Number(new Date());

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: './index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/react'],
          plugins: [
            [
              'import',
              {
                libraryName: 'antd',
                style: true, // or 'css'
              },
            ],
          ],
        },
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              modifyVars: {
                'primary-color': '#1DA57A',
                'link-color': '#1DA57A',
                'border-radius-base': '2px',
              },
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new webpack.ProgressPlugin((...args) => {
      const cur = Number(new Date());
      const [, msg, ...moduleInfo] = args;
      console.log(
        chalk.yellow(moduleInfo.join(' ')),
        chalk.green(cur - time + 'ms'),
        '==========',
        msg,
      );
      time = cur;
    }),
  ],
  devServer: {
    logLevel: 'silent',
    open: true,
    port: 8080,
  },
};
