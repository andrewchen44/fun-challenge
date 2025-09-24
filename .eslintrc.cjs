module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'import', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'coverage'],
  rules: {
    // Import hygiene
    'import/no-duplicates': 'error',
    'import/no-cycle': ['warn', { maxDepth: 1 }],
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],

    // TS safety
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
    '@typescript-eslint/explicit-function-return-type': 'off',

    // General clarity
    eqeqeq: ['error', 'always'],
    'no-unneeded-ternary': 'warn',
    'no-param-reassign': ['error', { props: false }],
    'no-fallthrough': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
