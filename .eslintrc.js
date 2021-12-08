module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:react/recommended',
  ],
  parser: '@babel/eslint-parser',

  settings: {
    react: {
      version: 'detect',
    },
  },

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
