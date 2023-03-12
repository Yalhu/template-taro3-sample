import Taro, { getApp } from "@tarojs/taro";

// const IsBlended = process.argv.includes("--blended");
/**
 * app全局变量
 * -
 */
const appInst = getApp() || {};
console.log('[config]appInst:', appInst)
/**
 * # 系统信息。
 *  1）原生小程序中有数据；优先获取。
 *  2）如果为空，或者单包运行小程序，通过api获取。
 *  3）h5不支持该方法，默认空对象。
 */
// eslint-disable-next-line import/no-mutable-exports
let { systemInfo = {}, networkType = "" } = appInst;
// console.log("systemInfo", systemInfo);
if (JSON.stringify(systemInfo) === "{}") {
    systemInfo = Taro.getSystemInfoSync() || {};
}
if (process.env.TARO_ENV === "h5") {
    networkType = navigator["connection"]?.type || navigator["connection"]?.effectiveType;
}
export {
    systemInfo,
    networkType
};

/**
 * # 启动参数。
 */
export const launchOptions = (() => {
    try {
        if (process.env.TARO_ENV === "h5") {
            // 路由模式非hash时有效。
            return {
                query: window.location.search.substring(1).split("&").reduce((pre, curr) => {
                    const [key, value] = curr.split("=");
                    return { ...pre, [key]: value };
                }, {}) as Record<string, string>
            }
        }
        return Taro.getLaunchOptionsSync?.();
    } catch (e) {
        console.error(e);
    }
})();
// console.log("launchOptions", launchOptions);

/* # 环境判断 */
const _ua = navigator?.userAgent;
export const IsWxEnv = process.env.TARO_ENV === "weapp" || /miniProgram/i.test(_ua) || window["__wxjs_environment"] === 'miniprogram';
// export const isQqEnv = /qq\/([\d\.]+)*/i.test(_ua);

/* # 全局数据 */
// export const globalData = {};

/* 雅典娜数据监控 */
export const bizid = process.env.TARO_ENV === "weapp" ? 3074 : 3071;

// h5不支持，返回Promise;catch会导致ts报错。
// export const accountInfo = Taro.getAccountInfoSync();
// eslint-disable-next-line import/no-mutable-exports
let accountInfo = { miniProgram: { appId: "", envVersion: "" } };
if (process.env.TARO_ENV === "weapp") {
    accountInfo = Taro.getAccountInfoSync(); // h5不支持，返回Promise。
}
export { accountInfo };

console.log("getAccountInfoSync", accountInfo);

/**
 * #  接口配置。
 */
const ApiEnv = launchOptions?.query?.api_env || process.env.API_ENV;
export const ApiConfig = {
    appId: process.env.TARO_ENV === "h5" ? "m91*******ff74" : accountInfo.miniProgram?.appId,
    version: process.env.npm_package_version,
    baseURL: (() => {
        // 小程序线上接口
        if (process.env.TARO_ENV === "weapp" && accountInfo.miniProgram?.envVersion === "release") {
            return "https://api.m.lorem.com";
        }
        if (ApiEnv === "dev") {
            return `${process.env.TARO_ENV === "weapp" ? 'https:' : ''}//beta-api.m.lorem.com`;
        }
        return `${process.env.TARO_ENV === "weapp" ? 'https:' : ''}//api.m.lorem.com`;
    })(),
    basePath: "/client.action",
    channel: "",
    bizModeClientType: {
        weapp: "WxMiniProgram",
        h5: "M"
    }[process.env.TARO_ENV],
    // suffix: process.env.TARO_ENV === "h5" ? "_m" : undefined,
}
