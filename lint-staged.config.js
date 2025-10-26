export default {
  '*.{ts,tsx}': ['bun run lint', 'node scripts/type-check-lint.js', 'bun run format'],
  '*.{js,cjs,mjs,json,md}': ['bun run lint', 'bun run format'],
  '*.{css,scss,less}': ['bun run stylelint'],
  '*.vue': [
    'bun run lint',
    'node scripts/type-check-lint.js',
    'bun run format',
    'bun run stylelint',
  ],
};
