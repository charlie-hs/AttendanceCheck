// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  env: {
    jest: true,
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // React
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'warn',

    // Prettier
    'prettier/prettier': 'warn',

    // Imports - ignore unresolved for some expo packages
    'import/no-unresolved': ['error', { ignore: ['^expo-symbols$'] }],
  },
  ignorePatterns: ['dist/*', 'node_modules/*', '.expo/*', 'android/*', 'ios/*'],
  overrides: [
    {
      // Relax unused-vars for test files (type imports for compilation check)
      files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
