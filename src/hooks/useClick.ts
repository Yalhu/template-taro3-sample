import { useEffect } from "react";

import { track } from '@/utils'
/**
 * 点击埋点监听。
 * @param deps
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useClick = (deps: Array<any> = []) => {
    console.log("[UseClick]. e:");
    // 点击埋点
    useEffect(() => {
        const handleClkTrack = (e) => {
            const target = e.target;
            console.log("[UseClick]. e:", e, target.dataset, e.mpEvent);
            let detail;
            if (process.env.TARO_ENV === 'h5') {
                // 冒泡 获取埋点元素
                const getTargetEle = (element) => {
                    const eid = element["data-eid"];
                    // console.log("[UseClick]getTargetEle.eid:%s", eid);
                    if (eid) {
                        return element;
                    }

                    const parent = element.parentNode;
                    return parent ? getTargetEle(parent) : undefined;
                }
                const trackEle = getTargetEle(target);
                if (trackEle) {
                    detail = trackEle.dataset;
                }
            } else {
                detail = e.mpEvent?.detail; // todo: 待测试
            }
            const { eid, eparam } = detail || {};
            track.clic(eid, eparam);
        }
        const trackEventName = process.env.TARO_ENV === "h5" ? 'click' : 'tracks';
        document.addEventListener(trackEventName, handleClkTrack);
        return () => document.removeEventListener(trackEventName, handleClkTrack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export { useClick };
