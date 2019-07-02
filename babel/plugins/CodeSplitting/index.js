/**
 * 解析JSX
 */
const babel = require('@babel/core');
const code = `
const a = ('\d');
const b = ('\\d');
`;
const result = babel.transform(code).code;
console.log(result);
