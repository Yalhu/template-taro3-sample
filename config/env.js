const fs = require("fs");

const appName = 'taroapp'
const pages = [
    "pages/demo/index",
];
if (process.env.TARO_ENV === "weapp") {
    if (process.env.BUILD_ENV !== "wxapp") {
        pages.push("pages/webview/index");
    }
}
if (process.env.NODE_ENV === "development" || process.env.BUILD_ENV === "beta") {
    pages.push("pages/demo-loader/index");
}
// console.log('[env]pages:', pages)
const customRoutes = pages.reduce((accu, curr) => {
    // 把demo-前缀去掉  // /index在h5换成后缀
    accu[curr] = curr.replace('pages/', '').replace('demo-', '').replace('/index', '.shtml')
    return accu
}, {})
console.log('custom-Routes', customRoutes)

module.exports = {
    appName,
    pages,
    customRoutes,
    appDirectory: fs.realpathSync(process.cwd()),
    outputRoot: (function() {
        // console.log('process.env.BUILD_ENV', process.env.BUILD_ENV)
        if (process.env.TARO_ENV === "weapp") {
            if (process.env.BUILD_ENV === "wxabuild") {
                return `../wxapp/wxa-build/pages/${appName}`
            }
            if (process.env.BUILD_ENV === "wxapp") {
                return `../wxapp/pages/${appName}`
            }
        } else {
            if (process.env.BUILD_ENV === "mstatic") {
                return `../m_static/assets/${appName}`
            }
        }
        return `dist/${process.env.TARO_ENV}`
    })(),
}
