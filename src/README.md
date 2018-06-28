# 解析过程

#### 原型链

他们是从下往上依次集成

- BaseParser

- CommentsParser

- LocationParser

- Tokenizer `state`对象，存储一些关键信息

- UtilParser

- NodeUtils

- LValParser

- ExpressionParser

- StatementParser

- Parser

- ParserPlugin 如果有特定的语法解析，会实例化该对象；比如`jsx`语法，会引入 jsx 相关的解析对象

### 语法解析

`jsx` ☠️ `typescript` ☠️ `flow` ☠️ `estree`

对象实例化

-> Parser `parse` -> NodeUtils `startNode` -> Tokenizer `nextToken` `skipSpace` -> ParserPlugin `readToken`

注意，如果引用了插件，`ParserPlugin`也有`readToken`。代码如下

```js
readToken(code) {
  //这里是该插件的词法判断代码...
  return super.readToken(code);
}
```

解析会优先解析符合当前插件的词法规则，否则就使用默认的词法解析

`babel-parser`词法、语法分析，目前内置了`estree`, `jsx`, `flow`, `typescript`分析插件

```js
import estree from './plugins/estree';
import flow from './plugins/flow';
import jsx from './plugins/jsx';
import typescript from './plugins/typescript';

// NOTE: estree must load first; flow and typescript must load last.
export const mixinPluginNames = ['estree', 'jsx', 'flow', 'typescript'];
export const mixinPlugins: { [name: string]: MixinPlugin } = {
  estree,
  jsx,
  flow,
  typescript,
};
```
