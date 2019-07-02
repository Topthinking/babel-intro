const dev = (process.env.NODE_ENV = 'development');

module.exports = {
  presets: [['@babel/preset-env'], '@babel/react'],
  plugins: [
    'react-loadable/babel',
    'react-hot-loader/babel',
    '@babel/plugin-syntax-dynamic-import',
  ],
};
