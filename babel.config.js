// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
    presets: [
        ['taro', {
            framework: 'react',
            ts: true,
            hot: false,
            useBuiltIns: process.env.TARO_ENV === "h5" ? 'usage' : false,
            targets: {
                ios: '9',
                android: '5'
            }
        }]
    ]
}
