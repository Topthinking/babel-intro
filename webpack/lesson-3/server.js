process.env.NODE_ENV = 'development';
require('@babel/register')({
  babelrc: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.11.1',
        },
        modules: 'commonjs',
      },
    ],
    '@babel/react',
  ],
  plugins: ['react-loadable/babel', 'dynamic-import-node'],
});

const webpack = require('webpack');
const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const Loadable = require('react-loadable');
const { getBundles } = require('react-loadable/webpack');

const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);

app.use(
  require('webpack-dev-middleware')(compiler, {
    logLevel: 'silent',
  }),
);

app.use(
  require('webpack-hot-middleware')(compiler, {
    log: false,
  }),
);

let Component = null;

global.start = (component) => {
  Component = component.default || component;
};

require('./src/app');

app.use((req, res, next) => {
  let modules = [];

  const stats = require('./dist/react-loadable.json');

  const html = renderToString(
    React.createElement(
      'code',
      {},
      React.createElement(
        Loadable.Capture,
        {
          report: (moduleName) => modules.push(moduleName),
        },
        React.createElement(Component),
      ),
    ),
  );
  let bundles = getBundles(stats, modules);
  console.log(1, bundles);
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    </head>
    <body>
      <div id="root">${html}</div>
      
    </body>
  </html>
`);
});

Loadable.preloadAll().then(() => {
  app.listen(3000, () => {
    console.log('Running on http://localhost:3000/');
  });
});
