'use strict';

// Object.defineProperty(exports, '__esModule', {
//   value: true,
// });
// exports.default = _default;

// var _path2 = require('path');

// var _stringHash = _interopRequireDefault(require('string-hash'));

// var _awardHelp = require('@xmly/award-help');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const check = (nodes, t, routes) => {
  nodes.map((item) => {
    if (t.isJSXElement(item)) {
      if (item.openingElement.name.name !== 'Route') {
        throw new Error('RouterSwitch内的组件必须都是Route');
      } else {
        let component = false,
          _path = false;
        const props = {};
        item.openingElement.attributes.map((attr) => {
          props[attr.name.name] = attr.value;

          if (t.isJSXExpressionContainer(attr.value)) {
            props[attr.name.name] = attr.value.expression;
          }

          if (attr.value === null) {
            props[attr.name.name] = t.BooleanLiteral(true);
          }

          if (attr.name.name === 'component') {
            component = true;
          }

          if (attr.name.name === 'path') {
            _path = true;
          }
        });

        if ((component && !_path) || (!component && _path)) {
          throw new Error(
            'Route组件必须保证component和path这两个props同时存在，或者同时不存在',
          );
        }

        if (item.children.length) {
          const childrens = [];
          check(item.children, t, childrens);
          const _childrenRoutes = [];
          childrens.map((children) => {
            const obj = []; // tslint:disable-next-line:forin

            for (const key in children) {
              obj.push(t.ObjectProperty(t.Identifier(key), children[key]));
            }

            _childrenRoutes.push(t.ObjectExpression(obj));
          });
          props.routes = t.ArrayExpression(_childrenRoutes);
        }

        routes.push(props);
      }
    }
  });
};

const splitting = (childrens, state, t, tpl) => {
  const reference = state && state.file && state.file.opts.filename;
  const isServer = state && state.opts && state.opts.isServer;
  const ts = state && state.opts && state.opts.ts;
  const subprocess = state && state.opts && state.opts.subprocess;

  if (childrens.length) {
    childrens.map((item) => {
      if (t.isJSXElement(item)) {
        if (item.openingElement.name.name === 'Route') {
          const attrs = item.openingElement.attributes;
          let sync = false;
          attrs.map((_item) =>
            _item.name.name === 'sync' ? (sync = true) : _item,
          );
          attrs.map((_item) => {
            if (_item.name.name === 'component') {
              if (t.isJSXExpressionContainer(_item.value)) {
                if (t.isIdentifier(_item.value.expression)) {
                  // 组件引用是变量
                  const name = _item.value.expression.name;

                  if (!state.hasImport[name]) {
                    state.hasImport[name] = true;

                    if (state.import[name]) {
                      return;
                      const _path_ = state.import[name];
                      const source = _path_.node.source.value;
                      const mod = (0, _awardHelp.requireResolve)(
                        source,
                        (0, _path2.resolve)(reference),
                      );

                      if (!mod || !mod.src) {
                        throw new Error(
                          `Path '${source}' could not be found for '${reference}'`,
                        );
                      }

                      if (isServer) {
                        if (!sync) {
                          item.openingElement.attributes.push(
                            t.JSXAttribute(
                              t.JSXIdentifier('__award__file__'),
                              t.StringLiteral(
                                String((0, _stringHash.default)(mod.src)),
                              ),
                            ),
                          );
                        }

                        if (ts) {
                          state.path.node.body.push(
                            tpl(`/**/const NAME = require(SOURCE).default`)({
                              NAME: t.Identifier(name),
                              SOURCE: t.stringLiteral(source),
                            }),
                          );
                        }
                      } else {
                        if (!sync) {
                          _path_.replaceWith(
                            tpl(`const NAME = (cb)=>{
                            return IMPORT(SOURCE).then((component)=>{
                              cb(component);
                            }).catch(err=>{
                              throw err
                            })
                          }`)({
                              NAME: t.Identifier(name),
                              SOURCE: t.stringLiteral(mod.src),
                              IMPORT: t.Import(),
                            }),
                          );
                        }
                      }
                    } else {
                      // 不是import引入，说明是当前js引用的变量
                      // 标记props同步
                      item.openingElement.attributes.push(
                        t.JSXAttribute(t.JSXIdentifier('sync')),
                      );
                    }
                  }
                } else {
                  // 组件引用, FunctionExpression, ArrowFunctionExpression
                  if (t.isFunctionExpression || t.isArrowFunctionExpression) {
                    // 标记props同步
                    item.openingElement.attributes.push(
                      t.JSXAttribute(t.JSXIdentifier('sync')),
                    );
                  }
                }
              }
            }
          });

          if (subprocess) {
            process.exit(0);
          }

          if (item.children.length) {
            splitting(item.children, state, t, tpl);
          }
        }
      }
    });
  }
}; // https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#-%E6%8F%92%E4%BB%B6%E7%9A%84%E5%87%86%E5%A4%87%E5%92%8C%E6%94%B6%E5%B0%BE%E5%B7%A5%E4%BD%9C

module.exports = function _default(babel) {
  const { types: t, template: tpl } = babel;
  return {
    name: 'CodeSplitting',
    visitor: {
      Program: {
        enter(_path, state) {
          state.exitRoutes = false;
          state.path = _path;
          const isServer = state && state.opts && state.opts.isServer;

          let a = 1;
          _path.traverse({
            ImportDeclaration(path) {
              const specifiers = path.node.specifiers;

              if (
                specifiers &&
                specifiers.length === 1 &&
                t.isImportDefaultSpecifier(specifiers[0])
              ) {
                const name = specifiers[0].local.name;

                if (!state.import) {
                  state.import = {};
                }

                state.import[name] = path;
              }

              state.hasImport = {};
            },

            JSXElement(path) {
              if (path.node.openingElement.name.name === 'RouterSwitch') {
                state.exitRoutes = true;
                const routes = []; // 这里要递归查找children
                splitting(path.node.children, state, t, tpl);
                check(path.node.children, t, routes);
                const _routes = [];
                routes.map((item) => {
                  const obj = []; // tslint:disable-next-line:forin

                  for (const key in item) {
                    obj.push(t.ObjectProperty(t.Identifier(key), item[key]));
                  }

                  _routes.push(t.ObjectExpression(obj));
                });

                if (isServer) {
                  a = _routes;
                  path.node.children = [
                    // tslint:disable-next-line:ban-comma-operator
                    t.JSXElement(
                      t.JSXOpeningElement(t.JSXIdentifier('p'), []),
                      t.JSXClosingElement(t.JSXIdentifier('p')),
                      [t.JSXText('路由出错了...')],
                    ),
                  ];
                  // _path.node.body.push(
                  //   tpl(`global.__AWARD__INIT__ROUTES__ = INIT`)({
                  //     INIT: t.ArrayExpression(_routes),
                  //     __AWARD__INIT__ROUTES__: t.Identifier(
                  //       '__AWARD__INIT__ROUTES__',
                  //     ),
                  //   }),
                  // );
                }
              }
            },
          });
          if (a !== 1) {
            _path.node.body.push(
              tpl(`global.__AWARD__INIT__ROUTES__ = INIT`)({
                INIT: t.ArrayExpression(a),
                __AWARD__INIT__ROUTES__: t.Identifier(
                  '__AWARD__INIT__ROUTES__',
                ),
              }),
            );
          }
        },
      },

      // JSXElement(_path, state) {
      //   const isServer = state && state.opts && state.opts.isServer;

      //   if (state.exitRoutes) {
      //     if (_path.node.openingElement.name.name === 'RouterSwitch') {
      //     }
      //   }
      // },
    },
  };
};
