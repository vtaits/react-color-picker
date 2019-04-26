const path = require('path');

const context = path.join(__dirname, 'example');

module.exports = {
  context,
  mode: 'development',
  entry: './index.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: [/\.js$/, /\.jsx$/],
      exclude: /(node_modules|dist)/,
      use: [{
        loader: 'babel-loader',
      }],
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    }],
  },
  resolve: {
    alias: {
      '@vtaits/react-color-picker': path.join(__dirname, 'src'),
    },
    modules: [
      'node_modules',
      'src',
    ],
    extensions: ['.js', '.jsx'],
  },
};
