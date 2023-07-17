/**
 * biz 上报 - 监控。
 * 非小程序：bizId|operationId|resultNo|source|message|traceId|perfTime
 */
import Taro from "@tarojs/taro";

import { bizid } from "@/config";

import { cookie, router } from "@/utils";

export interface Data {
    /** 业务id */
    biz?: number;
    /** 操作id */
    operation: number;
    /** 状态码 */
    result?: string;
    /** 结果信息 */
    message?: string;
    /** 耗时，单位ms */
    duration?: number;
}

const biz = (() => {
    // let timer;
    const cache: Array<Data> = [];

    const source = router.params().source || 0
    /* # 页面卸载时上报存量 */
    if (process.env.TARO_ENV === "h5" && navigator.sendBeacon) {
        window.addEventListener("beforeunload", () => {
            const contents = cache.splice(0, cache.length).map(item => {
                return [item.biz, item.operation, item.result, source, item.message, undefined, item.duration].join("|");
            }).join(",");

            contents && navigator.sendBeacon(`https://wq.m.com/webmonitor/collect.json?contents=${contents}&t=${Date.now()}`);
        });
    }

    /* ## 上报主逻辑 */
    return async (data: Data): Promise<void> => {
        if (data.biz === undefined) {
            cache.push({
                ...data,
                biz: bizid
            });
        } else {
            cache.push(data);
        }
        const execute = async () => {
            const contents = cache.splice(0, cache.length).map(item => {
                // source: 0 默认值。
                return [item.biz, item.operation, item.result, source, item.message, undefined, item.duration].join("|");
            }).join(",");
            console.log('[report].execute', contents)

            if (process.env.TARO_ENV === "h5") {
                const url = `https://wq.m.com/webmonitor/collect.json?contents=${contents}&t=${Date.now()}`;
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(url);
                } else {
                    await new Promise((resolve) => {
                        const image = new Image();
                        image.onload = () => {
                            resolve(undefined);
                        }
                        image.onerror = () => {
                            resolve(undefined);
                        }
                        image.src = url;
                    });
                }
            } else {
                const cookies = await cookie.getAll();

                await Taro.request({
                    method: "POST",
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'cookie': Object.keys(cookies).map(key => `${key}=${encodeURIComponent(cookies[key])}`).join(";"),
                        _noIntercept: true
                    },
                    url: "https://wq.m.com/webmonitor/collect.json",
                    data: {
                        contents
                    }
                }).then((res) => {
                    // console.log('[report]biz.res:', res)
                    if (res['errno'] !== "0") {
                        return Promise.reject(data);
                    }
                });
            }
        }

        execute()
    }
})();

const report = {
    biz
}

export default report;
