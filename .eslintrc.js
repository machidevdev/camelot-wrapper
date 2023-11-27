// eslint-disable-next-line no-undef
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // Or the version you prefer
    sourceType: 'module',
    project: './tsconfig.json', // Path to your TypeScript config (tsconfig.json)
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Recommended TypeScript rules
    'prettier', // To integrate with Prettier
  ],
  rules: {
    // Your custom rules here
  },
};
