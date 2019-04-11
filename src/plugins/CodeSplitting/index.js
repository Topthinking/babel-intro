/**
 * 解析JSX
 */
const babel = require('@babel/core');
const plugin = require('./plugin');
const code = `
import B from './b';

function A() {
  return (
    <div>
      <h1>hello 1</h1>
      <RouterSwitch>
        <Route path="/home" component={B} />
        <Route path="/detail/:id?" component={() => <h1>world</h1>} />
      </RouterSwitch>
      <h1>hello 2</h1>
    </div>
  );
}
`;

const result = babel.transform(code, {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [[plugin, { isServer: true }]],
}).code;

console.log(result);
