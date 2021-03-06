const moduleMap =  {
  ART: true,
  AccessibilityInfo: true,
  ActivityIndicator: true,
  Alert: true,
  Animated: true,
  AppRegistry: true,
  AppState: true,
  AsyncStorage: true,
  BackHandler: true,
  Button: true,
  CheckBox: true,
  Clipboard: true,
  ColorPropType: true,
  DeviceInfo: true,
  Dimensions: true,
  Easing: true,
  EdgeInsetsPropType: true,
  FlatList: true,
  I18nManager: true,
  Image: true,
  ImageBackground: true,
  InteractionManager: true,
  Keyboard: true,
  KeyboardAvoidingView: true,
  LayoutAnimation: true,
  Linking: true,
  ListView: true,
  Modal: true,
  NativeEventEmitter: true,
  NativeModules: true,
  NetInfo: true,
  PanResponder: true,
  Picker: true,
  PixelRatio: true,
  Platform: true,
  PointPropType: true,
  ProgressBar: true,
  RefreshControl: true,
  SafeAreaView: true,
  ScrollView: true,
  SectionList: true,
  Share: true,
  Slider: true,
  StatusBar: true,
  StyleSheet: true,
  SwipeableFlatList: true,
  SwipeableListView: true,
  Switch: true,
  Text: true,
  TextInput: true,
  TextPropTypes: true,
  Touchable: true,
  TouchableHighlight: true,
  TouchableNativeFeedback: true,
  TouchableOpacity: true,
  TouchableWithoutFeedback: true,
  UIManager: true,
  Vibration: true,
  View: true,
  ViewPropTypes: true,
  VirtualizedList: true,
  YellowBox: true,
  createElement: true,
  findNodeHandle: true,
  processColor: true,
  render: true,
  unmountComponentAtNode: true
};

const isCommonJS = (opts) => opts.commonjs === true;

const getDistLocation = (importName, opts) => {
  const format = isCommonJS(opts) ? 'cjs/' : '';
  if (importName === 'index') {
    return `react-native-web/dist/${format}index`;
  } else if (importName && moduleMap[importName]) {
    return `react-native-web/dist/${format}exports/${importName}`;
  }
};

const isReactNativeRequire = (t, node) => {
  const { declarations } = node;
  if (declarations.length > 1) {
    return false;
  }
  const { id, init } = declarations[0];
  return (
    (t.isObjectPattern(id) || t.isIdentifier(id)) &&
    t.isCallExpression(init) &&
    t.isIdentifier(init.callee) &&
    init.callee.name === 'require' &&
    init.arguments.length === 1 &&
    (init.arguments[0].value === 'react-native' ||
      init.arguments[0].value === 'react-native-web')
  );
};

const isReactNativeModule = ({ source, specifiers }) =>
  source &&
  (source.value === 'react-native' || source.value === 'react-native-web') &&
  specifiers.length;

module.exports = function({ types: t }) {
  return {
    name: 'Rewrite react-native to react-native-web',
    visitor: {
      ImportDeclaration(path, state) {
        const { specifiers } = path.node;
        console.log('react-native-web','import',path.node.source.value);
        if (isReactNativeModule(path.node)) {          
          const imports = specifiers
            .map((specifier) => {
              if (t.isImportSpecifier(specifier)) {
                const importName = specifier.imported.name;
                const distLocation = getDistLocation(importName, state.opts);

                if (distLocation) {
                  return t.importDeclaration(
                    [
                      t.importDefaultSpecifier(
                        t.identifier(specifier.local.name),
                      ),
                    ],
                    t.stringLiteral(distLocation),
                  );
                }
              }
              return t.importDeclaration(
                [specifier],
                t.stringLiteral(getDistLocation('index', state.opts)),
              );
            })
            .filter(Boolean);

          path.replaceWithMultiple(imports);
        }
      },
      ExportNamedDeclaration(path, state) {
        const { specifiers } = path.node;
        if (isReactNativeModule(path.node)) {
          const exports = specifiers
            .map((specifier) => {
              if (t.isExportSpecifier(specifier)) {
                const exportName = specifier.exported.name;
                const localName = specifier.local.name;
                const distLocation = getDistLocation(localName, state.opts);

                if (distLocation) {
                  return t.exportNamedDeclaration(
                    null,
                    [
                      t.exportSpecifier(
                        t.identifier('default'),
                        t.identifier(exportName),
                      ),
                    ],
                    t.stringLiteral(distLocation),
                  );
                }
              }
              return t.exportNamedDeclaration(
                null,
                [specifier],
                t.stringLiteral(getDistLocation('index', state.opts)),
              );
            })
            .filter(Boolean);

          path.replaceWithMultiple(exports);
        }
      },
      VariableDeclaration(path, state) {
        if (isReactNativeRequire(t, path.node)) {
          const { id } = path.node.declarations[0];
          if (t.isObjectPattern(id)) {
            const imports = id.properties
              .map((identifier) => {
                const distLocation = getDistLocation(
                  identifier.key.name,
                  state.opts,
                );
                if (distLocation) {
                  return t.variableDeclaration(path.node.kind, [
                    t.variableDeclarator(
                      t.identifier(identifier.value.name),
                      t.memberExpression(
                        t.callExpression(t.identifier('require'), [
                          t.stringLiteral(distLocation),
                        ]),
                        t.identifier('default'),
                      ),
                    ),
                  ]);
                }
              })
              .filter(Boolean);

            path.replaceWithMultiple(imports);
          } else if (t.isIdentifier(id)) {
            const name = id.name;
            const importIndex = t.variableDeclaration(path.node.kind, [
              t.variableDeclarator(
                t.identifier(name),
                t.memberExpression(
                  t.callExpression(t.identifier('require'), [
                    t.stringLiteral(getDistLocation('index', state.opts)),
                  ]),
                  t.identifier('default'),
                ),
              ),
            ]);

            path.replaceWith(importIndex);
          }
        }
      },
    },
  };
};
