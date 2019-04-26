module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'airbnb'],
  parser: 'babel-eslint',

  plugins: [
    'react',
  ],

  rules: {
    'arrow-parens': ['error', 'always'],
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
    'react/forbid-prop-types': 'off',
  }
};
