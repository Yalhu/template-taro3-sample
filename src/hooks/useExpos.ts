import Taro, { useDidShow, useDidHide } from "@tarojs/taro";
import { useRef, useEffect } from "react";
import { track, requestIdle } from '@/utils'

interface ExposObj {
    key?: string;
}
/*
 * 曝光埋点。
 *  在页面入口引入。
 * todo:
 * expType 上报类型：multi 批量上报 | 不传或者single 单点立即上报
 * expKey 唯一标识
 * expId 曝光id
 * eparam 曝光参数
 * eparam 曝光参数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useExpos = (deps: Array<any> = []) => {
    // timerRef
    // const timerRef = useRef<any>();
    // observer对象
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obRef = useRef<any>();
    // 曝光数据集合
    const exposRef = useRef<{ [propName: string]: Array<ExposObj> | boolean }>({});

    // 批量上报处理
    const batchExpos = ({ expId, expKey, eparam }) => {
        const key = expId + expKey;
        const expArr = exposRef.current[expId] // 解决push方法ts 报错
        if (Array.isArray(expArr)) {
            // 校验是否已经曝光
            if (exposRef.current[key] === false) {
                exposRef.current[key] = true;
                expArr.push(eparam);
            }
        } else {
            exposRef.current[key] = true;
            exposRef.current[expId] = [eparam];
        }
    };

    // 批量延迟上报
    const exposMutilReport = () => {
        console.log("exposMutilReport ", exposRef.current);
        // 遍历数据。有key(是否上报-布尔)和expid（批量数据-数组）// ？？数组可以批量上报成功？
        Object.keys(exposRef.current).forEach(expId => {
            if (typeof exposRef.current[expId] === "object") {
                track.expo(expId, exposRef.current[expId] as object);
            }
        });
        exposRef.current = {};
    };

    // 单点立即上报处理
    const singleExpos = ({ expId, expKey, eparam, eother }) => {
        const key = expId + expKey;
        if (!exposRef.current[key]) {
            console.log("单点立即上报. expId:%s; ", expId, exposRef.current);
            exposRef.current[key] = true;

            track.expo(expId, eparam, eother);
        }
    };

    useEffect(() => {
        /**
         * 处理监听。
         * @param e - {id, dataset, intersectionRatio, intersectionRect, time}
         *  h5:
         */
        const observeCb = (e) => {
            // const dataset = document.getElementById(res.id)?.dataset;
            let target;
            let dataset;
            // let intersectionRatio:number;
            if (process.env.TARO_ENV === 'h5') {
                target = e.target;
                dataset = target.dataset;
            } else {
                dataset = document.getElementById(e.id)?.dataset
            }
            // intersectionRatio = e.intersectionRatio
            // console.log("[Expo]observ-Cb.e:%o, dataset:%o", e, dataset/* , document.getElementById(e.id) */)
            if (!dataset) return;
            const {
                expid: expId,
                expType,
                expkey: expKey = '',
            } = dataset;
            let { eparam, eother } = dataset;
            if (!expId) return
            /* 统一传到track方法为对象 */
            if (eparam) {
                try {
                    eparam = JSON.parse(eparam)
                } catch (e) {
                    console.warn('曝光参数非stringify。', eparam)
                }
            }
            if (eother) {
                try {
                    eother = JSON.parse(eother)
                } catch (e) {
                    // console.warn('曝光参数非stringify。', eother)
                }
            }

            // 批量上报
            if (expType === "multi") {
                batchExpos({ expId, expKey, eparam });
            } else {
                singleExpos({ expId, expKey, eparam, eother });
            }
        }
        if (process.env.TARO_ENV === "weapp") {
            obRef.current = Taro.createIntersectionObserver(this as unknown as TaroGeneral.IAnyObject, {
                observeAll: true
            });
            obRef.current
                .relativeToViewport({ top: 10 })
                .observe(".expo", requestIdle(observeCb));
        } else {
            const options = {
                root: null,
                // rootMargin: '0px 0px 0px 0px',
                // threshold: [0, 0.3, 1],
            };
            const observer = new IntersectionObserver((entries/* , observer */) => {
                entries.forEach(requestIdle(observeCb));
                // entries.forEach(entry => {
                // Each entry describes an intersection change for one observed
                // target element:
                //   entry.boundingClientRect
                //   entry.intersectionRatio
                //   entry.intersectionRect
                //   entry.isIntersecting
                //   entry.rootBounds
                //   entry.target
                //   entry.time
                // const target = entry.target;
                // observeCb(entry)
                // });
            }, options);
            console.log("[Expo]doms:", document.querySelectorAll('.expo'))
            // eslint-disable-next-line semi-style
            ;[].slice.call(document.querySelectorAll('.expo')).forEach(el => {
                observer.observe(el);
            });

            // window['myObserver'] = observer;
            obRef.current = observer;
        }
        return (() => {
            obRef.current?.disconnect()
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    // 清空数据记录
    useDidShow(() => {
        exposRef.current = {};
    })
    useDidHide(() => {
        exposMutilReport();
    })

    // onUnload
    useEffect(() => {
        return () => {
            exposMutilReport();
        };
    }, []);

    return { exposMutilReport };
};

export { useExpos };
