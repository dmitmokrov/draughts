module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-idiomatic-order'],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
};
