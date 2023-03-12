import Taro from "@tarojs/taro";

import { ApiConfig } from "@/config";

type Method =
    | "GET"
    | "OPTIONS"
    | "POST"
    | "PUT"
    | "HEAD"
    | "DELETE"
    | "TRACE"
    | "CONNECT";

class HttpRequest {
    // eslint-disable-next-line class-methods-use-this
    async request(params, method: Method = "GET") {
        let { url, data } = params;
        let baseUrl = ApiConfig.baseURL;
        data = { ...data };
        url = url || "/client.action";

        const customHeader = { ...data?.headers };
        delete data.headers; // 清除data中自定义header

        // 自定义api链接
        if (customHeader.customApiUrl) baseUrl = "";

        // console.log("url, data", url, data, customHeader.customApiUrl);

        return Taro.request({
            url: baseUrl + url,
            data,
            method,
            credentials: "include",
            header: {
                "content-type": "application/x-www-form-urlencoded",
                // "content-type":
                //     method === "POST"
                //         ? "application/x-www-form-urlencoded"
                //         : "application/json;charset=UTF-8",
                ...customHeader
            },
            jsonp: data?.dataType === "jsonp"
        });
    }

    get(url?: string | object, data?: object) {
        if (typeof url === "object") {
            data = url;
            url = "";
        }
        const params = { url, data };
        return this.request(params, "GET");
    }

    post(url?: string | object, data?: object) {
        if (typeof url === "object") {
            data = url;
            url = "";
        }
        const params = { url, data };
        return this.request(params, "POST");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put(url: string, data?: any) {
        const params = { url, data };
        return this.request(params, "PUT");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete(url: string, data?: any) {
        const params = { url, data };
        return this.request(params, "DELETE");
    }
}

export default HttpRequest;
