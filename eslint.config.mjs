import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'


export default tseslint.config(
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  { ignores: ['dist', "__mocks__"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      "semi": ["error"],
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
      "eol-last": 1,
      "@stylistic/space-infix-ops": "error",
      "@stylistic/function-call-spacing": ["error", "never"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "function", "next": "function" },
        { "blankLine": "always", "prev": "*", "next": "export" }
      ],
      "@stylistic/indent": ["error", 2, { "ignoredNodes": ["ConditionalExpression"] }],
      "@stylistic/keyword-spacing": "error",
      "@stylistic/newline-per-chained-call": ["error", { "ignoreChainWithDepth": 2 }],
      "@stylistic/type-annotation-spacing": "error",
      "@stylistic/key-spacing": ["error", { "afterColon": true }],
      "@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/space-in-parens": ["error", "never"],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/arrow-spacing": "error",
      "@stylistic/quotes": ["error", "double"],
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
      }],
    },
  },
  {
    "files": ["**/*.test.ts"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
)
