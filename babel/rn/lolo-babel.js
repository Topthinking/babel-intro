"use strict";

const babel = require('@babel/core');

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

/**
 * lolo-sdk相关的babel插件处理方案
 */
const env = (memberExpression, text = []) => {
  if (memberExpression.object) {
    if (memberExpression.property && memberExpression.property.name) {
      text.unshift(memberExpression.property.name);
    }

    if (memberExpression.object.name) {
      // 遍历到对象引用的第一个字符串
      text.unshift(memberExpression.object.name);
    } else {
      // 继续遍历
      env(memberExpression.object, text);
    }
  }
};

const countMember = (text, t, MemberExpression) => {
  for (let i = 3; i < text.length - 1; i++) {
    MemberExpression = t.MemberExpression(MemberExpression, t.Identifier(text[i]));
  }

  return MemberExpression;
};

const webTraverseStyled = (path, state, t) => {
  path.traverse({
    ImportDeclaration(tPath) {
      console.log('lolo-babel','0999911111')
      const source = tPath.node.source;
      const specifiers = tPath.node.specifiers;

      if (t.isStringLiteral(source) && source.value === 'styled-components') {
        if (specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0])) {
          state.styledName = specifiers[0].local.name;
        }
      }

      if (t.isStringLiteral(source) && source.value === 'react-native') {
        console.log('lolo-babel',22222, path.node.source);
        state.rn = tPath.node;
      }
    }

  });
};

const changeRnImport = (path, state, t, name) => {
  if (state.rn) {
    const specifiers = state.rn.specifiers;
    let has = false;
    specifiers.map(item => {
      if (t.isImportSpecifier(item) && item.local.name === name) {
        has = true;
      }
    });
    console.log(1111, has, name);

    if (!has) {
      state.rn.specifiers.push(t.ImportSpecifier(t.Identifier(name), t.Identifier(name)));
    }

  } else {
    state.rn = t.ImportDeclaration([t.ImportSpecifier(t.Identifier(name), t.Identifier(name))], t.StringLiteral('react-native'));
    path.scope.path.node.body.unshift(state.rn);
  }
};

const webHandleStyled = (path, state, t) => {
  const text = [];
  env(path.node, text);

  if (state.styledName && text[0] === state.styledName) {
    if (text.length > 3) {
      console.log('lolo-babel',text)
      changeRnImport(path, state, t, text[1]);
      const MemberExpression = countMember(text, t, t.MemberExpression(t.CallExpression(t.Identifier(text[0]), [t.Identifier(text[1])]), t.Identifier(text[2])));
      path.node.object = MemberExpression;
    } else if (text.length === 3) {} else {
      console.log('lolo-babel',text)
      changeRnImport(path, state, t, text[1]);
      path.replaceWith(t.CallExpression(t.Identifier(text[0]), [t.Identifier(text[1])]));
    }
  }
};

const {
  types: t
} = babel;

function _default() {
  return {
    visitor: {
      Program(path, state) {
        // if (process.env.LOLO_RUN_ENV === 'web') {
          console.log('lolo-babel','09999')
          webTraverseStyled(path, state, t);
        // }
      },

      // 解析lolo-sdk，使其正确引用依赖
      ImportDeclaration(path) {
        console.log('lolo-babel','import',path.node.source.value);
        if (/^@xmly\/lolo-sdk/.test(path.node.source.value)) {
          const v = path.node.source.value.split('/');

          if (v[2] !== 'lib') {
            const type = process.env.LOLO_RUN_ENV === 'rn' ? 'rn' : 'web';
            path.node.source.value = `@xmly/lolo-sdk/lib/${v[2]}/${type}`;
          }
        }
      },

      // 根据环境变量来区分代码
      BinaryExpression(path) {
        /**
         * 类似
         * if(process.env.LOLO_RUN_ENV === 'web')
         */
        const left = path.node.left && t.isMemberExpression(path.node.left) && typeof path.node.right.value === 'string';
        const right = path.node.right && t.isMemberExpression(path.node.right) && typeof path.node.left.value === 'string';

        if (left || right) {
          let text = [];
          env(left ? path.node.left : path.node.right, text);
          text = text.join('.');

          if (/^process\.env\.LOLO/.test(text)) {
            if (eval(text) !== path.node.right.value) {
              path.parent.consequent = t.BlockStatement([]);
              path.parent.test = t.BooleanLiteral(false);
            } else {
              path.parent.test = t.BooleanLiteral(true);
            }
          }
        }
      },

      MemberExpression(path, state) {
        // if (process.env.LOLO_RUN_ENV === 'web') {
          webHandleStyled(path, state, t);
        // }
      }

    }
  };
}