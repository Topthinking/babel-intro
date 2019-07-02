const webpack = require('webpack');
const config = require('./webpack.config');
const compiler = webpack(config);

compiler.hooks.done.tap('done', (stats) => {
  // console.log('编译完成', stats);
});

compiler.run();
