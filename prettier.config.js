const pluginSortImports = require('@trivago/prettier-plugin-sort-imports');
const pluginTailwindcss = require('prettier-plugin-tailwindcss');

/** @type {import("prettier").Parser}  */
const myParser = {
  ...pluginSortImports.parsers.typescript,
  parse: pluginTailwindcss.parsers.typescript.parse,
};

/** @type {import("prettier").Plugin}  */
const myPlugin = {
  parsers: {
    typescript: myParser,
  },
};

module.exports = {
  // plugins: [require('@trivago/prettier-plugin-sort-imports')],
  plugins: [myPlugin],
  semi: true,
  printWidth: 120,
  trailingComma: 'all',
  singleQuote: true,
  tabWidth: 2,
  arrowParens: 'avoid',
  importOrder: ['^react$|^react/(.*)$', '^next$|^next/(.*)$', '<THIRD_PARTY_MODULES>', '^./|^../'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
};
