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
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
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
    'react/require-default-props': ['error', {
      functions: 'defaultArguments',
    }],
    'react/jsx-props-no-spreading': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'semi': 'error',
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    'import/resolver': {
      typescript: true,
    },
  },
}
