export default {
  '*.{ts,tsx,vue}': ['bun run lint', 'node scripts/type-check-lint.js'],
  '*.{js,cjs,mjs,json,md}': ['bun run lint']
}