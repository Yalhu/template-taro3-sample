module.exports = {
    env: {
        NODE_ENV: '"development"'
    },
    defineConstants: {},
    mini: {},
    h5: {
        // webpackChain(config) {
        //     config.module
        //         .rule('ssi')
        //         .test(/\.html$/)
        //         .use('html-loader')
        //         .loader('html-loader')
        //         .end()
        //         .use('ssi-loader')
        //         .loader('webpack-ssi-include-loader')
        //         .options({
        //             // localPath: path.resolve(__dirname, '../../m_static'),
        //             location: 'https://trade.m.lorem.com/', // http url where the file can be dl
        //         });
        // },
        devServer: {
            // https: true, // 该配置项已弃用，以支持 devServer.server。
            // server: "https",
            host: "127.0.0.1", // 本机ip会变
            allowedHosts: [
                '.lorem.com'
            ],
            port: 10086,
            hot: false, // > 为了 liveReload 能够生效，devServer.hot 配置项必须禁用或者 devServer.watchFiles 配置项必须启用
            open: false,
            // historyApiFallback: true,
            // static: [
            //     { directory: path.join(__dirname, 'assets') }, // 未验证和使用
            //     { directory: path.join(__dirname, 'src/mocks') }, // next：添加接口mock服务
            // ],
            client: {
                overlay: false
            },
            proxy: {
                //   "/client.action": {
                //     target: "https://beta-api.m.lorem.com",
                //     changeOrigin: true,
                //     headers: {
                //       referer: "https://api.lorem.com",
                //       Origin: "https://api.lorem.com"
                //     }
                //   },
                // "/webmonitor/collect/biz.json": {
                //     target: "wq.lorem.com/webmonitor/collect/biz.json",
                //     changeOrigin: true,
                //     headers: {
                //         referer: "https://api.lorem.com",
                //         Origin: "https://api.lorem.com"
                //     }
                // }
            },
            // watchFiles: {
            //     paths: ["src/**/*", "src/*", "node_modules/@xx/recommend"],
            //     options: {
            //         // usePolling: false,
            //     },
            // },
        },
    }
}
