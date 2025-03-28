// @ts-nocheck

import eslint from '@eslint/js';
import * as eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginSort from 'eslint-plugin-sort';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as regexpPlugin from 'eslint-plugin-regexp';

/** @type {import('eslint').Linter.Config[]} */
const configs = [
  { ignores: ['**/prettier.config.*', '**/eslint.config.*'] },
  regexpPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.worker,
        ...globals.commonjs,
        ...globals.node,
      },
      parser: /** @type {import('eslint').Linter.Parser} */ (tseslint.parser),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        project: true,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': /** @type {import('eslint').ESLint.Plugin} */ (tseslint.plugin),
      import: eslintPluginImport,
      react: eslintPluginReact,
      sort: eslintPluginSort,
      perfectionist: eslintPluginPerfectionist,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.strictTypeChecked.at(-1)?.rules,
      ...eslintConfigPrettier.rules,
      ...eslintPluginImport.configs.recommended.rules,
      ...eslintPluginSort.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReact.configs['jsx-runtime'].rules,
      '@typescript-eslint/no-invalid-void-type': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-var-requires': ['off'],
      '@typescript-eslint/only-throw-error': ['off'],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      eqeqeq: ['error', 'always', { null: 'never' }],
      'import/no-named-as-default': ['off'],
      'import/no-named-as-default-member': ['off'],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'react/jsx-sort-props': 'off',
      'perfectionist/sort-jsx-props': [
        'error',
        {
          groups: ['first', 'shorthand', 'unknown', 'callback'],
          customGroups: {
            first: ['^key$', '^ref$'],
            callback: '^on.+',
          },
        },
      ],
      'sort/imports': ['off'],
      'sort/type-properties': ['error'],
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
      'import/resolver': {
        typescript: {
          conditionNames: ['node', 'require', 'import', 'default'],
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
];

export default configs;
