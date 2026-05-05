module.exports = {
  env: {
    browser: true,
    es2022: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:jsx-a11y/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: '18.0'
    }
  }
};
