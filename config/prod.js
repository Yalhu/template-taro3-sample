const HtmlWebpackPlugin = require("html-webpack-plugin");

const buildConfig = require('./env');

const { appName, pages, customRoutes, appDirectory, outputRoot } = buildConfig

const {
    BundleAnalyzerPlugin
} = require("webpack-bundle-analyzer");

module.exports = {
    env: {
        NODE_ENV: '"production"'
    },
    defineConstants: {},
    mini: {
        webpackChain: (chain, webpack) => {
            chain.optimization.minimizer('terserPlugin')
                .tap(args => {
                    args[0].extractComments = false
                    return args
                })
            // chain.plugin("bundleAnalyzerPlugin").use(BundleAnalyzerPlugin, [{
            //     analyzerMode: "static",
            //     openAnalyzer: false,
            //     reportFilename: "../../config/analyzer.weapp.html"
            // }]);
        }
    },
    h5: {
        webpackChain: (chain, webpack) => {
            chain.optimization.minimizer('terserPlugin')
                .tap(args => {
                    // console.log('args', JSON.stringify(args))
                    args[0].extractComments = false
                    return args
                })

            chain.plugins.delete('htmlWebpackPlugin');
            Object.values(customRoutes).map(page => {
                // const pageName = page.replace(/pages\/(?<=)(.*)(?=)\/index/, '$1')
                chain.plugin("htmlWebpackPlugin-" + page)
                    .use(new HtmlWebpackPlugin({
                        title: "购买完成",
                        filename: page,
                        inject: 'body',
                        template: "src/index.html",
                        minify: false,
                    }))
            })

            /**
             * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
             * 参考代码如下：
             */
            // chain.plugin("bundleAnalyzerPlugin").use(BundleAnalyzerPlugin, [{
            //     analyzerMode: "static",
            //     openAnalyzer: false,
            //     reportFilename: "../../config/analyzer.h5.html"
            // }]);
        }
    }
}
