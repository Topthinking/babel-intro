/**
 * 解析JSX
 */
const babel = require('@babel/core');
const { parse } = require('@babel/parser');

const code = `var a = <h1>hello world</h1>; var b = <span>hello world</span>;`;

// 插件
const plugin1 = {
  visitor: {
    Identifier(path) {
      path.node.name = path.node.name + 'c';
    },
    JSXIdentifier(path) {
      if (path.node.name == 'h1') {
        path.node.name = 'h3';
      }
    },
  },
};

const plugin2 = {
  visitor: {
    JSXIdentifier(path) {
      if (path.node.name == 'h1') {
        path.node.name = 'h2';
      }
    },
  },
  // 设置了该方法的插件优先解析--- 字符串，优先加载内置的词法、语法解析器，比如jsx、ts、flow、estree
  /**
   * 
   *
   * import estree from "./plugins/estree";
    import flow from "./plugins/flow";
    import jsx from "./plugins/jsx";
    import typescript from "./plugins/typescript";

    // NOTE: estree must load first; flow and typescript must load last.
    export const mixinPluginNames = ["estree", "jsx", "flow", "typescript"];
    export const mixinPlugins: { [name: string]: MixinPlugin } = {
      estree,
      jsx,
      flow,
      typescript,
    };
   */
  manipulateOptions(opts, parserOpts) {
    parserOpts.plugins.push('jsx');
  },
};

const preset = {
  plugins: ['transform-react-jsx'],
};

const result = babel.transform(code, {
  //presets: [preset],
  plugins: [plugin2],
}).code;

console.log(result);
