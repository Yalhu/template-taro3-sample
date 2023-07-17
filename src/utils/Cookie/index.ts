import Taro from "@tarojs/taro";
import { bridge } from "@/utils";

const get = async (name: string): Promise<string> => {
    const { data: { _expire: expire, _data: data } } = await Taro.getStorage({ key: 'cookies' }).catch(() => ({ data: {} }));
    if (expire <= Date.now()) {
        throw new Error("cookies expire");
    }

    if (!(name in data)) {
        throw new Error(`cookies["${name}"] not exists`);
    }

    const item = data[name];
    if (item.expires !== "session" && new Date(item.expires) <= new Date()) {
        throw new Error(`cookies["${name}"] expire`);
    }

    return item.value;
}

const getAll = async (): Promise<Record<string, string>> => {
    const { data: { _expire: expire, _data: data } } = await Taro.getStorage({ key: 'cookies' }).catch(() => ({ data: {} }));
    if (expire <= Date.now()) {
        throw new Error("cookies expire");
    }

    const record: Record<string, string> = {};
    for (const key in data) {
        const value = data[key];
        if (value.expires === "session" || new Date(value.expires) > new Date()) {
            record[key] = value.value;
        }
    }
    return record;
}

const set = async (name: string, value: string, options?: { domain?: string; path?: string; secure?: boolean; expires?: number; }): Promise<void> => {
    const { expires = 365 } = options || {};
    if (bridge.cookie?.set) {
        return bridge.cookie.set(name, value);
    }

    const item = {
        name,
        value,
        expires: new Date(Date.now() + 1000 * 3600 * 24 * expires).toUTCString()
    };

    const { data: { _data: data = {} } } = await Taro.getStorage({ key: 'cookies' }).catch(() => ({ data: {} }));

    data[name] = item;

    await Taro.setStorage({
        key: "cookies",
        data: {
            _data: data,
            _expire: 9876543210 * 1000
        }
    });
}

const cookie = {
    get,
    getAll,
    set
};

export default cookie;
