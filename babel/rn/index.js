/**
 * 解析JSX
 */
const babel = require('@babel/core');
const RN = require('babel-preset-react-native');
const LOLOBABEL = require('./lolo-babel').default
const REACTNATIVEWEB = require('./react-native-web')
const code = `
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

const TextInfo = styled.Text\`
  color: blue;
\`;

export default class extends React.Component {
  render() {
    return (
      <View>
        <TextInfo>style</TextInfo>
      </View>
    );
  }
}

`;

// 插件
const info = LOLOBABEL()
const plugin = {  
  // 设置了该方法的插件优先解析--- 字符串，优先加载内置的词法、语法解析器，比如jsx、ts、flow、estree
  manipulateOptions(opts, parserOpts) {
		// parserOpts.plugins.push('typescript');
    parserOpts.plugins.push('jsx');
  },
};

let result = babel.transform(code, {
	presets:[{plugins:[plugin]}],
	plugins:[LOLOBABEL]
}).code;

// result = babel.transform(result, {
// 	plugins:[REACTNATIVEWEB]
// }).code;

console.log()
console.log(result);
