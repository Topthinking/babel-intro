const webpack = require('webpack');

const name = 'MyPlugin';

class MyPlugin {
  apply(compiler) {
    compiler.hooks.invalid.tap(name, (fileName, changeTime) => {});
    compiler.hooks.thisCompilation.tap(name, (compilation) => {
      const { mainTemplate } = compilation;
    });
    compiler.hooks.emit.tapAsync(name, (compilation, callback) => {
      const str = '{}';
      compilation.assets['emit.json'] = {
        source() {
          return str;
        },
        size() {
          return str.length;
        },
      };
      callback();
    });
    compiler.hooks.done.tap(name, (states) => {
      console.log(states);
    });
  }
}

compiler.hooks.invalid.tap(name, (fileName, changeTime) => {});
compiler.hooks.thisCompilation.tap(name, (compilation) => {
  const { mainTemplate } = compilation;
});
compiler.hooks.emit.tapAsync(name, (compilation, callback) => {
  const str = '{}';
  compilation.assets['emit.json'] = {
    source() {
      return str;
    },
    size() {
      return str.length;
    },
  };
  callback();
});
compiler.hooks.done.tap(name, (states) => {
  console.log(states);
});

module.exports = {
  devtool: 'source-map',
  entry: './index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
  },
  plugins: [new MyPlugin()],
};
