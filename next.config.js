const withImages = require('next-images')

// module.exports = (phase, { defaultConfig }) => {
//   return {
//     //   i18n: {
//     //     locales: ['en-US', 'zh-CN', 'ja-JP'],
//     //     defaultLocale: 'en-US',
//     // }
//     target: 'serverless'
//   }
// }

module.exports = withImages({
  webpack(config, options) {
    return config
  },
  target: 'serverless' // for netlify
  // i18n: {
  //   locales: ["en-US", "zh-CN"],
  //   defaultLocale: "en-US",
  // },
})