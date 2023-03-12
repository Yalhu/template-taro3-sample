const path = require("path");
const fs = require("fs");
const ESLintPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackAssetsTagAlterPlugin = require("html-webpack-asset-tag-alter-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const buildConfig = require('./env');

const { appName, pages, customRoutes, appDirectory, outputRoot } = buildConfig
// console.log('[config]build-Config', buildConfig)

const resolveAppPath = (relativePath) => path.resolve(appDirectory, relativePath);

const config = {
    projectName: appName,
    date: "2022-12-7",
    designWidth: 750,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
    },
    sourceRoot: "src",
    outputRoot,
    defineConstants: {
        "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
        "process.env.API_ENV": `"${process.env.API_ENV}"`,
        "process.env.BUILD_ENV": `"${process.env.BUILD_ENV}"`,
        "process.env.npm_package_version": `"${process.env.npm_package_version}"`,
        "process.argv": `${JSON.stringify(process.argv)}`
    },
    plugins: [
        "@tarojs/plugin-indie",
        path.join(process.cwd(), "/plugins/update/index.ts"),
        path.join(process.cwd(), '/plugins/track/index.ts'),
        path.join(process.cwd(), "/plugins/move/index.ts"),
    ],
    // copy: {
    //     patterns: [
    //         { from: 'src/asset/', to: 'dist/asset/', ignore: ['*.txt'] }
    //     ],
    //     options: {}
    // },
    framework: "react",
    compiler: {
        type: 'webpack5',
        prebundle: {
            enable: process.env.TARO_ENV === 'weapp' && process.env.NODE_ENV === 'development' // Taro 会在小程序环境的 dev 模式下默认开启依赖预编译功能。
        }
    },
    // 发版时流水线打包
    cache: {
        enable: true
    },
    alias: {
        "@": resolveAppPath("src"),
        "react-dom/client": "@tarojs/react",
        '~': (process.env.BUILD_ENV === 'wxapp' || process.env.BUILD_ENV === 'wxabuild') ? resolveAppPath("..") : '../../comp'
    },
    mini: {
        // baseLevel: 20,
        postcss: {
            pxtransform: {
                enable: true,
                config: {}
            },
            url: {
                enable: true,
                config: {
                    limit: 1024 // 设定转换尺寸上限
                }
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: "global", // 转换模式，取值为 global/module
                    generateScopedName: "[folder]_[local]_[hash:base64:5]"
                }
            }
        },
        esnextModules: ["@plato/ui"],
        compile: {
            include: [(filename) => /recoil|buffer|query\-string|split\-on\-first/.test(filename)]
        },
        terser: {
            // enable: true, // 默认值true
            config: {
                safari10: true,
            }
        },
        miniCssExtractPluginOption: {
            ignoreOrder: true
        },
        webpackChain: (chain, webpack) => {
            chain.plugin("forkTsCheckerWebpackPlugin").use(ForkTsCheckerWebpackPlugin, [{
                async: process.env.NODE_ENV === "development"
            }]);
            chain.plugin("eslintPlugin").use(ESLintPlugin, [{
                extensions: ["js", "mjs", "jsx", "ts", "tsx"],
                eslintPath: require.resolve("eslint"),
                context: resolveAppPath("src"),
                cache: true,
                cacheLocation: path.resolve(resolveAppPath("node_modules"), ".cache/.eslintcache"), // ESLint class options
                cwd: resolveAppPath("."),
                resolvePluginsRelativeTo: __dirname
            }]);
            chain.merge({
                output: {
                    chunkLoadingGlobal: "webpackJsonpPayDone",
                },
                externals: [
                    (context, request, callback) => {
                        if (process.env.BUILD_ENV === 'wxapp' || process.env.BUILD_ENV === 'wxabuild') {
                            // console.log('externals.wxaPath:', request)
                            const wxaPath = '~'
                            if (request.startsWith(wxaPath)) {
                                const externalDirPath = config.alias[wxaPath];
                                const res = request.replace(
                                    new RegExp(wxaPath, 'ig'),
                                    path.relative(context, externalDirPath)
                                );
                                // console.log('externals.context:%s, request:%s', context, request, res)
                                return callback(null, `commonjs ${res}`);
                            }
                        }
                        callback();
                    }
                ]
            });
        }
    },
    h5: {
        publicPath: process.env.NODE_ENV === "development" ? `/${appName}` :
            `//${process.env.BUILD_ENV === "beta" ? "beta-" : ""}lorem.cn/${appName}/`,
        entry: {
            app: [path.join(appDirectory, 'src', 'app.config')],
        },
        output: {
            filename: 'js/[name].[chunkhash].js',
            chunkFilename: 'js/[name].[chunkhash].js',
            crossOriginLoading: "anonymous"
        },
        staticDirectory: "static",
        postcss: {
            autoprefixer: {
                enable: true,
                config: {}
            },
            cssModules: {
                enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: "global", // 转换模式，取值为 global/module
                    generateScopedName: "[folder]_[local]_[hash:base64:5]"
                }
            }
        },
        esnextModules: ['@plato/ui'],
        // terser 配置只在生产模式下生效。
        terser: {
            enable: true, // 默认值 true
            config: {
                safari10: true
            }
        },
        miniCssExtractPluginOption: {
            filename: "css/[name]_[contenthash:8].css",
            chunkFilename: "css/[name]_[contenthash:8].css"
        },
        htmlPluginOption: {
            title: "购买完成",
            inject: 'body',
            // filename: "done.shtml",
            minify: false,
        },

        router: {
            mode: "browser", // 默认使用 hash 模式
            basename: '/' + appName,
            // customRoutes: {
            //     "/pages/demo/index": "/buy/demo.shtml",
            //     "/pages/done/index": "/buy/done.shtml",
            // },
            customRoutes
        },

        webpackChain: (chain, webpack) => {
            chain.plugin("forkTsCheckerWebpackPlugin").use(ForkTsCheckerWebpackPlugin, [{
                async: process.env.NODE_ENV === "development"
            }]);

            chain.plugin("eslintPlugin").use(ESLintPlugin, [{
                extensions: ["js", "mjs", "jsx", "ts", "tsx"],
                eslintPath: require.resolve("eslint"),
                context: resolveAppPath("src"),
                cache: true,
                cacheLocation: path.resolve(
                    resolveAppPath("node_modules"),
                    ".cache/.eslintcache"),
                // ESLint class options
                cwd: resolveAppPath("."),
                resolvePluginsRelativeTo: __dirname
            }]);

            chain.plugin("HtmlWebpackAssetsTagAlterPlugin")
                .use(new HtmlWebpackAssetsTagAlterPlugin({
                    assetTags: {
                        scripts: {
                            onerror: "__reloadResource(this)",
                            crossorigin: "anonymous"
                        },
                        styles: {
                            onerror: "__reloadResource(this)"
                        }
                    },
                }));
        }
    }
};

module.exports = function (merge) {
    if (process.env.NODE_ENV === "development") {
        return merge({}, config, require("./dev"));
    }
    return merge({}, config, require("./prod"));
};
