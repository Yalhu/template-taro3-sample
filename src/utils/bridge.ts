/**
 * 桥接不同应用下的全局工具函数。
 */
interface Config {
    pay ? : {
        switch ? : {
            /** 完成页地址 */
            doneUrl ? : string;
        }
    }
}

export interface Bridge {
    cookie ? : {
        set ? : (key: string, value: string) => Promise < void > ;
        get ? : (key: string) => Promise < string > ;
    };
    state ? : {
        get ? : (key: string) => Record < string, unknown > ;
    };
    globalConfig ? : {
        get ? : < T extends keyof Config > (key: T) => Promise < Config[T] > ;
    };
    libs ? : {
        ParamsSign ? : (data: {
            appId: string;
            debug: boolean;
        }) => {
            sign: (data: {
                functionId: string;
                appid: string;
                client: string;
                clientVersion: string;
                t: string;
                body: string;
            }) => void
        };
    },
    /**
     * 跳转页面
     * @desc 快捷跳转页面方法，跳转时会将参数编码
     * @param {String} url 目标页面路径
     * @param {Object} params 需要传的参数
     * @param {Object} options  { method: 跳转方式, skipSwitchUrl: 是否跳过URL的转换}
     */
    goto?: (url:string, params?: string | object, options?: object) => void
}

const bridge: Bridge = {};

if (process.env.TARO_ENV === "weapp") {
    console.log('[birdge].wx:', wx)
    /**
     * 原生小程序通过LOEREM.js 注入到全局的wx变量。
     */
    if (process.env.BUILD_ENV === 'wxapp' || process.env.BUILD_ENV === 'wxabuild') {
        const cookie = wx.LOEREM?.bridge?.cookie;
        if (cookie) {
            bridge.cookie = cookie;
        }
        // 哪里配置的state？？
        const state = wx.LOEREM?.bridge?.state;
        if (state) {
            bridge.state = state;
        }

        // global-config: 灰度控制等。 // 哪里配置的config？？
        const config = wx.LOEREM?.bridge?.config;
        if (config) {
            bridge.globalConfig = config;
        }

        const libs = wx?.LOEREM?.bridge?.libs
        if (libs) {
            bridge.libs = libs;
        }

        const goto = wx.LOEREM?.wxapp?.goto
        if (goto) {
            bridge.goto = goto
        }
    }
}

export default bridge;
