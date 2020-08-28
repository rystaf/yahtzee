const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    '**/*.jsx',
  ],
  whitelist: ['html'],
  whitelistPatterns: [/side\d/],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    purgecss,
  ]
}
