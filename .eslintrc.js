module.exports = {
  root: true,
  extends: [
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
  ],
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['import', 'promise', '@typescript-eslint', 'prettier'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/lines-between-class-members': 'off',
    'react/jsx-wrap-multilines': 'off',
    'multiline-comment-style': ['error', 'starred-block'],
    'promise/catch-or-return': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/jsx-closing-bracket-location': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    'mocha/no-mocha-arrows': 'off',
    'no-return-await': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-console': 'error',
    'no-prototype-builtins': 'off',
    'import/no-cycle': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 1,
    'no-restricted-syntax': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-no-bind': 'off',
    'lines-between-class-members': 'off',
    'max-classes-per-file': 'off',
    'react/react-in-jsx-scope': 'off',
    'max-len': ['warn', { code: 140 }],
    '@typescript-eslint/return-await': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@notifire/shared/*', '@notifire/dal/*', '!import2/good'],
      },
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: ['*'] },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['if', 'for'] },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
  },
};
