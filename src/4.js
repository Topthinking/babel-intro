/**
 * 解析JSX
 */
const babel = require('@babel/core');
const es2015 = require('babel-preset-es2015');
const react = require('babel-preset-react');
const code = `import * as React from 'react';
import { start } from '@xmly/award';

const App = (props: any) => <h1>hello world</h1>;

start(App);

`;

// 插件
const plugin = {
  visitor: {
    Identifier(path) {
      path.node.name = path.node.name + 'c';
    },
    JSXIdentifier(path) {
      if (path.node.name == 'h1') {
        path.node.name = 'h2';
      }
    },
  },
  // 设置了该方法的插件优先解析--- 字符串，优先加载内置的词法、语法解析器，比如jsx、ts、flow、estree
  manipulateOptions(opts, parserOpts) {
    parserOpts.plugins.push('typescript');
    parserOpts.plugins.push('jsx');
  },
};

const result = babel.transform(code, {
  plugins: [plugin],
}).code;

console.log(result);
