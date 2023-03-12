/* eslint-disable @typescript-eslint/no-explicit-any */
// import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { useEffect, useState, useCallback, useMemo } from "react";

import { getApiData } from "@/apis";
// import ErrorBoundary from '@/components/ErrorBoundary'
// import DataBoundary from '@/components/DataBoundary'
// import Error from '@/components/Error'
import { withCatcher, withData } from "@/hocs";

import Comp from './components/comp1'
// console.log('with', withCatcher, withData)
// interface IndexProps {
//     routerParams: {
//         dealId?: string,
//     },
//     data: any,
//     otherParams?: any,
//     status: 'loading' | 'success' | 'error',
// }
const SelfLoading = () => <View style={{ color: '#0f0' }}>i am child loading ... ...</View>
function Demo(props) {
    const { routerParams, data, status, ...otherProps } = props
    // const pageOptions: PageOptionsI = useMemo(() => Taro.getCurrentInstance().router?.params || {}, []);
    // console.log('router', Taro.getCurrentInstance().router, pageOptions);
    console.log('[Demo].props:', routerParams, data, status, otherProps)
    const { dealId } = routerParams
    const [hello, setHello] = useState('hello-init')
    const [count, setCount] = useState(0)
    // const [resData, setResData] = useState({})

    useEffect(() => {
        setHello('hello-effect')
    }, [dealId]);

    const handleClick = useCallback(() => {
        setCount(count + 1)
    }, [count]);

    // 把同步父组件的数据（count），和接口新请求（otherParams）放到同一组件了。
    const Floor = useMemo(() => withData<{ otherProp?: string, count?: number }>(
        Comp,
        {
            func: getApiData,
            // routeParamsKey: ['dealId', { orderId: 'dealId' }],
            otherParams: {
                orderId: '238329681716',
            }
        },
        {
            LoadingComp: SelfLoading,
            childProps: {
                otherProp: 'other prop',
                count,
            }
        }
    ), [count])

    return (
        <View>
            <View>status: {status}</View>
            <View>effect: {hello}</View>
            <View>
                <Text>count: {count}</Text>
                <Button onClick={handleClick}>点击</Button>
            </View>
            <View>
                {
                    data && data.dealstate &&
                    <View>data dealId: {data.dealstate.dealId}</View>
                }
            </View>
            <Floor />
        </View>
    )
}

export default withCatcher(withData(
    Demo,
    {
        func: getApiData,
        routeParamsKey: ['dealId', { orderId: 'dealId' }]
    }
));
