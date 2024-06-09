module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      modules: true,
    },
    ecmaVersion: 2020,
    project: [
        'tsconfig.eslint.json',
        'tsconfig.json',
        'tsconfig.node.json',
    ],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
        },
    ],
    'import/extensions': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-filename-extension': ['error', {
      "allow": "as-needed",
      "extensions": [".tsx"],
      "ignoreFilesWithoutCode": true,
    }],
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "vite.config.ts",
        "**/*.test.js",
      ]}],
    'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
    ],
    'react/require-default-props': ['error', {
      functions: 'defaultArguments',
    }],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-props': [
      'warn',
      {
        ignoreCase: true,
      },
    ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'semi': 'error',
    'no-shadow': 'off',
    'no-undef': 'error',
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
}
