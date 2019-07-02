var loaderUtils = require('loader-utils');
const path = require('path');
const babel = require('@babel/core');

const right = () => {
  return {
    visitor: {
      Program(path) {
        path.node.body = [path.node.body[0].expression.right];
      },
    },
  };
};

module.exports = function(content) {
  console.log(3, content);
  const code = babel.transform(content, {
    plugins: [right],
  }).code;
  const pathfile = path.join(__dirname, '..', 'handle.js');
  return `module.exports = require('${pathfile}').call(this,${code})`;
};
