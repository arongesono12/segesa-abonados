// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      '.bun-cache/*',
      'src/APITester.tsx',
      'src/App.tsx',
      'src/frontend.tsx',
      'src/index.ts',
      'src/index.css',
      'src/index.html',
      'src/logo.svg',
      'src/react.svg',
    ],
  },
]);
