/**
 * 分步解析
 */
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

//源码
const code = `var a = 2;`;

//词法分析 -> 语法分析 -> 抽象语法树
//这里会将js分析为抽象语法树，同时也会将jsx、ts等内置的语法规则进行语法树的分析
const ast = parse(code);

//转换 -> 遍历、更新节点 即对ast对象进行操作
//这里是根据规则执行每个插件，同时根据插件更改ast对象节点
traverse(ast, {
  enter(path) {
    path.node.name = 'b';
  },
});

//生成 -> 根据抽象语法树转换成代码
//根据ast对象转成js代码
const result = generator(ast).code;

// var b = 2;
console.log(result);
