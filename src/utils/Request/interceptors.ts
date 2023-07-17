// import Taro from '@tarojs/taro';

import { bizOperations, } from '@/consts/api-strengthen'
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
                    await doLogin(body.loginUrl);
                }
                throw Error(JSON.stringify(res));
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

// 强制登录/跳转登录
const doLogin = async (loginUrl) => {
    if (!loginUrl) return
    const link = router.getCurrLink();
    console.log('doline', link)
    router.redirect({
        url: `${loginUrl}${encodeURIComponent(
            link
        )}`,
        complete: () => {
            setTimeout(() => {
                isDoLogin = false;
            }, 500);
        }
    });
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
