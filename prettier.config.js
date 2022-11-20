module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports','prettier-plugin-tailwindcss'],
  semi: true,
  printWidth: 120,
  trailingComma: 'all',
  singleQuote: true,
  tabWidth: 2,
  arrowParens: 'avoid',
  pluginSearchDirs: false,
  importOrder: ['^react$|^react/(.*)$', '^next$|^next/(.*)$', '<THIRD_PARTY_MODULES>', '^./|^../'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
};
