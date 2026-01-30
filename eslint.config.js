import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'vite.config.ts',
      'eslint.config.js',
      '.husky/**',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.strictTypeChecked,

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      unicorn,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
      'unicorn/prevent-abbreviations': 'off',

      'no-console': 'warn',
      'max-lines-per-function': [
        'error',
        { max: 40, skipComments: true, skipBlankLines: true },
      ],
    },
  },
];
