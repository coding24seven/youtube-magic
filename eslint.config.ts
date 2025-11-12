import js from '@eslint/js';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { Config, defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const reactConfig: Config = {
  name: 'react',
  ...pluginReact.configs.flat.recommended,
  settings: {
    react: {
      version: 'detect',
    },
  },
};

const customConfig: Config = {
  name: 'custom',
  languageOptions: {
    parser: typescriptEslint.parser,
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
    globals: {
      ...globals.browser /* for: 'window' is not defined  no-undef */,
      ...globals.webextensions /* for: 'browser' is not defined  no-undef */,
      ...globals.node /* for: 'process' is not defined  no-undef */,
      NodeJS: true /* for: 'NodeJS' is not defined  no-undef */,
    },
  },
  /* no need for registering `plugins: { '@typescript-eslint': typescriptEslintPlugin, prettier: eslintPluginPrettier }` in order to use `rules`, as those plugins are already included in their respective config objects */
  rules: {
    'prettier/prettier':
      'error' /* makes any Prettier violation an error, and eslint --fix runs Prettier to resolve it. */,
    'no-case-declarations': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

export default defineConfig([
  globalIgnores(['watch-output', 'build-output']),
  { name: 'js/recommended', ...js.configs.recommended },
  typescriptEslint.configs
    .recommended /* sets default TS rules, and registers @typescript-eslint as a plugin, so rules such as '@typescript-eslint/no-unused-vars' can be used in configs, without adding `plugins: {'@typescript-eslint': typescriptEslintPlugin}` in those configs */,
  reactConfig,
  customConfig,
  eslintPluginPrettierRecommended /* enables the eslint-config-prettier config which will turn off ESLint rules that conflict with Prettier, via prettier/prettier rule */,
]);
