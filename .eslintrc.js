module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@babel/eslint-parser',

  settings: {
    react: {
      version: 'detect',
    },
  },

  plugins: [
    'react',
    '@typescript-eslint',
  ],

  rules: {
    'arrow-parens': ['error', 'always'],
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
  }
};
