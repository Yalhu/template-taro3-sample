/* eslint-disable @typescript-eslint/no-explicit-any */
// next: 解决ts any问题
// import React from "react";
// import { View } from "@tarojs/components";
import Taro from '@tarojs/taro'
import { useState, useCallback, useEffect, useMemo } from "react";

import Error from "@/components/Error";
import Loading from '@/components/Loading'
// import Loading from "@/components/Loading";

// import { } from '@/types/'
interface Props {
    status?: 'loading' | 'success' | 'error';
    data?: any;
    routerParams?: any;
    reload?: () => void;
}
// 接口数据。
interface Loader {
    func: (_args) => Promise<ApiResultI>,
    routeParamsKey?: (string | object) [], // 接口需要的页面参数key或者key: alias
    otherParams?: { [propname:string]: any } // 接口需要的其他参数
}
// 第三个参数：包含其余所有。
interface Others<T> {
    LoadingComp?: React.ComponentType, // 自定义loading组件，比如骨架屏等。
    ErrorComp?: React.ComponentType, // 自定义报错组件。如果异常可以隐藏。
    childProps?: T // 传入组件的其他数据。比如父组件传递的数据
}

const withData = <T extends any>(WarppedComponent: React.FC<Props & T>, loader: Loader, others?: Others<T>) => {
    const DataBoundary = () => {
        console.log('[with-data]others', others);
        const routerParams = useMemo(() => Taro.getCurrentInstance().router?.params || {}, []);
        console.log('[with-data]router', Taro.getCurrentInstance().router, routerParams);
        const { LoadingComp, ErrorComp, childProps } = others || {}
        const [reloadTimes, setReloadTimes] = useState(0);
        // const [needReload, setNeedReload] = useState(false);

        const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
        const [data, setData] = useState()
        const [errorInfo, setErrorInfo] = useState('')

        const reoloadPage = useCallback(() => {
            console.log("reload page. times: ", reloadTimes);
            setStatus('loading')
            // setNeedReload(false);
            setReloadTimes(reloadTimes + 1);
        }, [reloadTimes]);

        const getPageData = useCallback(async () => {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            ;(async function getPageData() {
                const { func, routeParamsKey, otherParams } = loader
                let funcParams = {}
                if (Array.isArray(routeParamsKey)) {
                    funcParams = routeParamsKey.reduce((accu, curr) => {
                        if (typeof curr === 'string') {
                            accu[curr] = routerParams[curr]
                        }
                        if (typeof curr === 'object') {
                            Object.entries(curr).forEach(([key, val]) => {
                                accu[key] = routerParams[val]
                            })
                        }
                        return accu
                    }, {})
                }
                Object.assign(funcParams, otherParams)
                // 主接口数据
                func(funcParams)
                    .then(res => {
                        console.log('[with-data]func:res', res, funcParams)
                        const { code, body } = res || {}
                        setData(body)
                        if (code === '0') {
                            setStatus('success')
                        } else {
                            setStatus('error')
                            // const errorCode = body?.errorCode
                            const errorReason = body?.errorReason || body?.errReason
                            // 风控
                            // if (errorCode === '601') {}
                            if (errorReason) {
                                setErrorInfo(errorReason)
                            }
                        }
                    })
                    .catch(err => {
                        console.warn('[with-data]func:catch', err)
                        setStatus('error')
                    })
            }())
        }, [routerParams])

        /* 获取接口数据 */
        useEffect(() => {
            getPageData()
        }, [getPageData, reloadTimes]);

        /* h5中骨架屏处理 */
        useEffect(() => {
            if (process.env.TARO_ENV === "h5") {
                const skeleton = document.getElementById("skeleton")
                if (!skeleton) return
                if (status === 'loading') {
                    // 隐藏骨架屏
                    skeleton.style.display = "block"
                } else {
                    setTimeout(() => {
                        skeleton.style.display = "none"
                    })
                }
            }
        }, [status]);

        if (status === 'loading') {
            if (LoadingComp) {
                return <LoadingComp />
            }
            // h5页面使用html中的骨架屏
            if (process.env.TARO_ENV === 'h5') {
                return null
            }
            return <Loading text="加载中" />
        }
        if (status === 'error') {
            if (ErrorComp) {
                return <ErrorComp />
            }
            return <Error
                info={errorInfo}
                image="https://img12.leremimg.com/img/s308x308_jfs/t1/128888/32/35397/8583/64086274Fe97d79a4/58d2867a673911bf.png"
                btnText="重新加载"
                onBtnFun={reoloadPage}
            />
        }

        return <WarppedComponent status={status} data={data} routerParams={routerParams} reload={reoloadPage} {...(childProps as any)} />
    }
    // 设置开发者工具显示名称,如果不设置开发者工具显示的外壳组件都是一样的
    function getDisplayName(WarppedComponent) {
        return WarppedComponent.displayName || WarppedComponent.name || 'DataComponent'
    }
    // 给组件添加displayName属性
    DataBoundary.displayName = `WithData${getDisplayName(WarppedComponent)}`
    return DataBoundary
}
export default withData;
