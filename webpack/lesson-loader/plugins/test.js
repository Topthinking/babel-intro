module.exports = class Test {
  apply(compiler) {
    compiler.hooks.done.tap('done', () => {
      global.abc = true;
    });
  }
};
