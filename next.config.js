const withImages = require('next-images');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');

// module.exports = (phase, { defaultConfig }) => {
//   return {
//     //   i18n: {
//     //     locales: ['en-US', 'zh-CN', 'ja-JP'],
//     //     defaultLocale: 'en-US',
//     // }
//     target: 'serverless'
//   }
// }

// module.exports = withImages({
//   webpack(config, options) {
//     return config
//   },
//   target: 'serverless' // for netlify
//   // i18n: {
//   //   locales: ["en-US", "zh-CN"],
//   //   defaultLocale: "en-US",
//   // },
// })

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    return config;
  },
  target: 'serverless',
};

module.exports = withPlugins([[withImages, withFonts]], nextConfig);
