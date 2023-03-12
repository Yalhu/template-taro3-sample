// import Taro from '@tarojs/taro';

import { bizOperations, } from '@/common/js/api-strengthen'
import { ApiConfig } from "@/config";

import { cookie, report, router, requestIdle } from "@/utils";

// 是否正在登录（避免重复登录）
let isDoLogin = false;

export const requestInterceptor = async function (chain) {
    const requestParams = chain.requestParams;
    const { method, data, url } = requestParams;

    const cookies = await cookie.getAll().catch((): Record<string, string> => ({}));
    if (!/\/webmonitor\/collect\/biz\.json/.test(url)) {
        console.log(`[http]request. ${method || 'GET'} --> ${url} data: `, data, cookies);
    }
    if (!requestParams?.header) {
        requestParams.header = {};
    }

    if (process.env.TARO_ENV !== "h5") {
        requestParams.header.cookie = Object.keys(cookies).map(key => `${key}=${encodeURIComponent(cookies[key])}`).join(";")
    }
    // 直接请求，不拦截处理 header?._noIntercept = true 例如：上报请求
    if (requestParams.header._noIntercept) {
        return chain.proceed(requestParams);
    }

    // 各端 赋能体系 公共参数
    const commbodyParam = {
        appId: ApiConfig.appId,
        bizModeClientType: ApiConfig.bizModeClientType,
    };
    let functionId = requestParams.data.functionId;

    if (process.env.TARO_ENV === "h5") {
        functionId = `${functionId}_m`;
        requestParams.data.functionId = functionId;
    }
    requestParams.data = {
        t: Date.now(),
        functionId,
        ...requestParams.data,

        body: JSON.stringify({ ...commbodyParam, ...requestParams.data.body })
    };

    return chain.proceed(requestParams);
}

const responseInterceptor = function (chain) {
    const requestParams = chain.requestParams
    const { method, data, url } = requestParams
    const functionId = data.functionId;

    return chain.proceed(requestParams)
        .then(async res => {
            // if (!requestParams.header._noIntercept) return
            if (!functionId) return res.data
            // handleResponse(res)
            console.log(`[http]response. ${method || 'GET'} --> ${url}; res: %o`, res);
            const startTime = data.t;

            const resData = res.data;

            const { body, code } = resData;
            const errorCode = body?.errorCode;

            /* # 接口上报 */
            const operation = bizOperations[functionId?.replace(/_m$/, '')];
            const umpParams = {
                result: errorCode || code,
                operation,
                duration: Date.now() - startTime,
                message: resData?.message || resData?.msg || body?.errorReason || body?.errReason
            };
            if (errorCode === "302") {
                umpParams.message = "未登录"
            }

            // console.log('[http]ump parmas', functionId.replace(/_m$/, ''), umpParams, bizOperations)
            requestIdle(() => report.biz(umpParams))()
            /* # 接口code处理 */
            if (errorCode === "302") {
                if (!isDoLogin) {
                    isDoLogin = true;
                    await doLogin();
                }
            }
            return res.data
        })
        .catch(res => {
            console.warn(`[http]error. ${method || 'GET'} --> ${url} data: `, res);
            // handleResponse(res)
            return res
        })
}
// const handleResponse = async function (res) {
//     // console.log(`http <-- ${url} result:`, res);

//     // console.log("umpParams:%s", umpParams);
// }

function getPageLink():string {
    if (process.env.TARO_ENV === 'h5') {
        return window.location.href
    // eslint-disable-next-line no-else-return
    } else {
        console.log('next')
        // next: 小程序
        // let route = "";
        // const pages = Taro.getCurrentPages();
        // if (!pages.length) return
        // const currPage = pages[pages.length - 1];
        // route = "/" + currPage?.route;
        // if (params) {
        //     route = route + "?" + querystring(params);
        // }
        // if (needOriginParams) {
        //     if (route.indexOf("?") > -1) {
        //         route = route + "&" + querystring(currPage.options);
        //     } else {
        //         route = route + "?" + querystring(currPage.options);
        //     }
        // }
        return ''
    }
}

// 强制登录/跳转登录
const doLogin = async () => {
    const link = getPageLink();
    if (process.env.TARO_ENV === "h5") {
        router.to({
            url: `https://plogin.m.lorem.com/user/login.action?appid=300&returnurl=${encodeURIComponent(link)}&source=done`
        });
    } else if (process.env.TARO_ENV === "weapp") {
        if (process.env.BUILD_ENV === "wxabuild") {
            router.to({
                url: `/pages/my/account/index?returnUrl=${encodeURIComponent(
                    link
                )}&navBackType=navigateBack`,
                complete: () => {
                    setTimeout(() => {
                        isDoLogin = false;
                    }, 500);
                }
            });
        }
    }
};

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
const interceptors = [
    requestInterceptor,
    responseInterceptor,
    // customInterceptor,
    // Taro.interceptors.logInterceptor,
];

export default interceptors;
