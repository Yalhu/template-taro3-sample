import Taro from "@tarojs/taro";

import interceptors from "./interceptors";
import HttpRequest from "./request";

interceptors.forEach(customInterceptor => Taro.addInterceptor(customInterceptor));

const request = new HttpRequest();

export const get = <T>(url?: string | object, data?: object):Promise<T> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return request.get(url, data) as any;
};

export const post = (url?: string | object, data?: object) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return request.post(url, data) as any;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const put = (url: string, data?: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return request.put(url, data) as any;
};
