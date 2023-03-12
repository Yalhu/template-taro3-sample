const get = async (name: string): Promise<string> => {
    const t = new RegExp(`(^| )${name}(?:=([^;]*))?(;|$)`);
    const r = document.cookie.match(t);

    if (!r || !r[2]) return "";

    const o = r[2];

    try {
        if (/(%[0-9A-F]{2}){2,}/.test(o)) {
            // utf8解码
            return decodeURIComponent(o);
        }
        // unicode解码
        return unescape(o);
    } catch (e) {
        return unescape(o);
    }
}

const getAll = async (): Promise<Record<string, string>> => {
    const cookies: Record<string, string> = {};

    document.cookie?.split(";").forEach((item) => {
        const [key, value] = item.split("=");
        cookies[key?.trim()] = value?.trim() || "";
    });

    return cookies;
}

const set = async (name: string, value: string, options?: { domain?: string; path?: string; secure?: boolean; expires?: number; }): Promise<void> => {
    const { domain = 'lorem.com', path = '/', secure = false, expires = 365 } = options || {};
    const expireDate = new Date(Date.now() + 1000 * 3600 * 24 * expires).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expireDate}${path ? `;path=${path}` : ''}${domain ? `;domain=${domain}` : ''}${secure ? ';secure' : ''}`;
}

const cookie = {
    get,
    getAll,
    set
};

export default cookie;
