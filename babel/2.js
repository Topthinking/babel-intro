/**
 * 使用babel-core集成的API
 * 即babel-loader使用的方式
 * preset和plugin执行的顺序分析
 */
const babel = require('@babel/core');

// 源码
const code = `var a = 2;`;

// 插件
const plugin1 = {
  visitor: {
    Identifier(path) {
      path.node.name = path.node.name + 'b';
    },
  },
};

const plugin2 = {
  visitor: {
    Identifier(path) {
      path.node.name = path.node.name + 'c';
    },
  },
};

/** 使用plugin */

// 转译 -> 从前往后解析
const plugin_result = babel.transform(code, {
  plugins: [plugin1, plugin2], // c 、d
}).code;

// var abc = 2;
console.log('plugin按顺序执行 > ', plugin_result);

/** 使用preset */

const preset1 = {
  plugins: [plugin1],
};

const preset2 = {
  plugins: [plugin2],
};

// 转译  -> 从后往前解析
const preset_result = babel.transform(code, {
  presets: [preset1, preset2], // c、 d
}).code;

// var acb = 2;
console.log('preset按倒序执行 > ', preset_result);

/**plugin 和 preset集成 */

const combine_result = babel.transform(code, {
  presets: [preset1], // c
  plugins: [plugin2], // d
}).code;

// var acb = 2;
console.log('先执行plugins再执行presets > ', combine_result);
