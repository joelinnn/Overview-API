module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootdir: './',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  env: {
    'node': true,
  },
  root: true,
};