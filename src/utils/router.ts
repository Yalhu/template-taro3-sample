import Taro from "@tarojs/taro";
import { debounce } from "lodash-es";

import { bridge } from "@/utils";

interface Option {
    url: string;
    state?: Record<string, unknown>;
    params?: Record<string, string | number | boolean | undefined>;
    title?: string;
    method?: string;
    webview?: string;
}

interface ToOtherMiniOptions extends Taro.navigateToMiniProgram.Option {
    appId: string;
    path?: string;
    isEmbed?: boolean;
    // envVersion?: string | undefined; // trial: 体验版；develop：开发；release：正式版
    // extraData?: object | any;
    // success?: Function;
    // fail?: Function;
    // complete?: Function;
}

// const getContext = (): object => {
//     if (process.env.TARO_ENV === "weapp") {
//         return wx;
//     }
//     return window;
// }

// const getKey = (): string => {
//     const key = "__router_state_key__";
//     const context = getContext();
//     context[key] = context[key] || 0;
//     return `${context[key]++}`;
// }

// const cache: Array<{ id: string; state?: Option["state"] }> = (() => {
//     const key = "__router_state_cache__";
//     const context = getContext();
//     context[key] = context[key] || [];
//     return context[key];
// })();

const goto = (() => {
    const execute = ({ url, state, params, method, title, webview, ...rest }: Taro.navigateTo.Option & Option) => {
        console.log("[Router]to.url:%s", url);
        // next: 处理内部跳转
        if (process.env.TARO_ENV === "h5") {
            window.location.href = url;
            // return;
        } else {
            // eslint-disable-next-line no-lonely-if
            if (process.env.BUILD_ENV === 'wxapp' || process.env.BUILD_ENV === 'wxabuild') {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;(bridge as { goto: (args, param) => void }).goto(url, params);
            } else {
                Taro.navigateTo({
                    url,
                    ...rest
                });
            }
        }
    }
    if (process.env.TARO_ENV === 'h5') {
        return debounce(execute, 400, { leading: true, trailing: false });
    // eslint-disable-next-line no-else-return
    } else {
        return execute
    }
})();

const router = {
    // next: 单独实现url
    // url: ({ url, state, params, title, webview = "../webview/index" }: Option) => {
    //     const target = URI(url);

    //     params && target.setQuery(params);

    //     if (process.env.TARO_ENV === "weapp" && /^(https?:)?\/\//i.test(url)) {
    //         target.protocol("https");
    //         return `${webview}?title=${encodeURIComponent(title || "")}&url=${encodeURIComponent(target.toString())}`;
    //     }

    //     if (state) {
    //         const id = getKey();
    //         target.setQuery("__state__", id);
    //         cache.push({ id, state });
    //     }

    //     return target.toString();
    // },
    to: (params: Taro.navigateTo.Option & Option) => {
        return goto(params);
    },
    redirect: ({ url, state, params, title, webview, ...rest }: Taro.redirectTo.Option & Option) => {
        // return
        if (process.env.TARO_ENV === "h5") {
            window.location.replace(url);
        } else {
            if (process.env.BUILD_ENV === 'wxapp' || process.env.BUILD_ENV === 'wxabuild') {
                return router.to({ url, method: 'redirectTo' })
            }
            Taro.redirectTo({
                // url: router.url({ url, state, params, title, webview }),
                url,
                ...rest
            });
        }
    },
    reLaunch: ({ url, state, params, title, webview, ...rest }: Taro.reLaunch.Option & Option) => {
        if (process.env.TARO_ENV === 'h5') {
            window.location.reload()
        } else {
            return Taro.reLaunch({
                // url: router.url({ url, state, params, title, webview }),
                url,
                ...rest
            });
        }
    },
    /**
     * 跳转其他小程序。
     *  navigateToMiniProgram or openEmbeddedMiniProgram.
     */
    toOtherMiniApp({ appId, path = "", isEmbed = false, envVersion, extraData }: ToOtherMiniOptions) {
        if (/^(http)|(\/\/)/.test(path)) {
            return this.to({ url: path });
        }
        if (!appId || !path) {
            console.error("跳转小程序出错：appid 或path不存在。appid: ", appId, "; path: ", path);
            return
        }
        const method = isEmbed ? "openEmbeddedMiniProgram" : "navigateToMiniProgram";
        Taro[method]({
            appId,
            path,
            extraData,
            envVersion, // 要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。
            complete: (res) => {
                console.log('跳转小程序完成。res: ', res)
            },
            fail: (e) => {
                console.warn('跳转其他小程序失败.e: ', e)
            }
        });
    },
    back: (options?: Taro.navigateBack.Option) => {
        if (process.env.TARO_ENV === "h5") {
            return new Promise((resolve, reject) => {
                const onChange = (e) => {
                    resolve(e);
                    window.removeEventListener('beforeunload', onChange);
                    window.removeEventListener('popstate', onChange);
                }
                window.addEventListener('beforeunload', onChange);
                window.addEventListener('popstate', onChange);
                setTimeout(() => {
                    reject();
                }, 500);
            }).then(() => {
                console.info("back success");
            }).catch(() => {
                document.referrer && window.location.replace(document.referrer);
            });
        }
        return Taro.navigateBack(options);
    },
    // state: <T = Option["state"]>(): T | undefined => {
    //     const params = Taro.getCurrentInstance()?.router?.params;
    //     const id = params?.["__state__"] || params?.["__pid"];
    //     if (!id) {
    //         return;
    //     }
    //     return params?.["__state__"] ? cache.find(item => item.id === id)?.state as T : bridge?.state?.get?.(id) as T;
    // },
    /**
     * 返回页面参数。
     * - 兼容h5。
     * @returns
     */
    params: () => {
        const parameters: Record<string, string> = {};
        if (process.env.TARO_ENV === "h5") {
            window.location.search.substring(1).split("&").forEach((item) => {
                const [key, value] = item.split("=");
                if (!key || !value || value === `${undefined}`) {
                    return;
                }
                try {
                    parameters[key] = decodeURIComponent(value).trim();
                } catch (e) {
                    console.error(e);
                }
            });
        }

        const params = Taro.getCurrentInstance().router?.params;
        params && Object.keys(params).forEach((key) => {
            const value = params[key];
            if (!value || value === `${undefined}`) {
                return;
            }
            try {
                parameters[key] = value && decodeURIComponent(value).trim();
            } catch (e) {
                console.error(e);
            }
        });

        /*
        // 暂时不需要解析wxapp中pid参数。
        const pid = params?.["__pid"];
        if (pid) {
            const state = bridge?.state?.get?.(pid);
            state && Object.keys(state).forEach((key) => {
                const value = state[key];
                if (value === undefined || value === `${undefined}` || typeof value === "object") {
                    return;
                }
                try {
                    parameters[key] = decodeURIComponent(`${value}`).trim();
                } catch (e) {
                    console.error(e);
                }
            });
        } */

        return parameters;
    },
    query: () => {
        const params = router.params();
        return Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join("&");
    }
}

export default router;
