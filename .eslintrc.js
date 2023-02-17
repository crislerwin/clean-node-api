module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    indent: 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
