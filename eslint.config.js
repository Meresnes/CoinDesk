import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        '@stylistic/ts': stylisticTs,
        'import': importPlugin,
    },
      settings: {
          'import/resolver': {
              typescript: { project: './tsconfig.json' },
          },
          node: {
              extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.json', '.svg'],
          },
      },
      rules: {
          ...reactHooks.configs.recommended.rules,
          'react-refresh/only-export-components': [
              'warn',
              { allowConstantExport: true },
          ],
          '@stylistic/ts/indent': ['error', 4],
          '@stylistic/ts/quotes': ['error', 'double', { avoidEscape: true }],
          '@stylistic/ts/semi': ['error', 'always'],
          '@stylistic/ts/comma-spacing': ['error', { before: false, after: true }],
          'object-curly-spacing': ['error', 'never'],
          'import/order': ['error', {
              groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
              alphabetize: { order: 'asc', caseInsensitive: true },
          }],
          'import/no-unresolved': 'warn',
          'import/newline-after-import': 'error',
          'import/no-duplicates': 'error',
      },
  },
)
