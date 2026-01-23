import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      unicorn: unicorn,
    },
    rules: {
      ...unicorn.configs['recommended'].rules,
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            acc: true,
            env: true,
            i: true,
            j: true,
            props: true,
            Props: true,
          },
        },
      ],
    },
    ignores: ['dist/**', 'node_modules/**']
  },

  prettierRecommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      'no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, 7, 10, 100, 200, 404, 429, 500],
          ignoreArrayIndexes: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'error',
    },
  },

  {
    files: ['eslint.config.js', 'eslint.config.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
);
