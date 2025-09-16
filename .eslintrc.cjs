/* eslint-env node */
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  settings: {
    react: { version: 'detect' }
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '.next',
    '**/*.config.js',
    '**/*.config.cjs'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
};


