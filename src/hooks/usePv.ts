import { useDidShow } from "@tarojs/taro";

import { requestIdle, track } from "@/utils";

/**
 * 页面pv上报。
 * @param pageId - 埋点id。
 */
const usePv = (pageId, eparam?, others?) => {
    useDidShow(() => {
        requestIdle(() => {
            track.pv(pageId, eparam, others);
        })();
    })
}

export { usePv };
