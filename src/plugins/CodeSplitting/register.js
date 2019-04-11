const plugin = require('./plugin');
require('@babel/register')({
  presets: ['@babel/env', '@babel/react'],
  plugins: [
    'react-require',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        regenerator: true,
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    'minify-constant-folding',
    [
      'module-resolver',
      {
        root: [process.cwd()],
        alias: {
          '@': './',
        },
      },
    ],
    [plugin, { isServer: true }],
  ],
  compact: false,
  babelrc: false,
  extensions: ['.jsx', '.js'],
});
require('./a');

console.log(2222, global.__AWARD__INIT__ROUTES__);
