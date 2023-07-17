/* eslint-disable @typescript-eslint/no-explicit-any */
// import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { useEffect, useState, useCallback } from "react";

import { getApiData } from "@/apis";
import { demo_pv, demo_cli, demo_expo } from '@/consts/ea-points/demo'
// import ErrorBoundary from '@/components/ErrorBoundary'
// import DataBoundary from '@/components/DataBoundary'
// import Error from '@/components/Error'
import { withCatcher, withData } from "@/hocs";
import { usePv, useExpos } from "@/hooks";

import Comp from './components/comp1'

// interface IndexProps {
//     data: any, // 接口返回数据
//     // 页面路由参数
//     routerParams: {
//         dealId?: string,
//     },
// }
function Demo(props) {
    const { routerParams, data, status, reload, ...otherProps } = props
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

    /* pv埋点上报 */
    usePv(demo_pv);
    // 曝光埋点
    useExpos([data]);

    return (
        <View>
            <View>status: {status}</View>
            <View>effect: {hello}</View>
            <View>
                <Text
                    className="expo"
                    data-expid={demo_expo}
                >
                    count: {count}
                </Text>
                <Button
                    data-eid={demo_cli}
                    onClick={handleClick}
                >
                    点击+1
                </Button>
            </View>
            <Comp />
            <View>data errCode: {data.errCode}</View>
            {
                data && data.dealstate &&
                <View>data dealId: {data.dealstate.dealId}</View>
            }
            {/* <View>data: {JSON.stringify(data)}</View> */}
            <View>
                <Button onClick={handleClick}>切换订单号: 实现不了</Button>
            </View>
            <Button onClick={reload}>刷新页面</Button>
        </View>
    )
}

// const Demo: React.FC = () => {
//     return (
//         <ErrorBoundary>
//             <DataBoundary dataLoader={getApiData} >
//                 {(props) => renderPage(props)}
//             </DataBoundary>
//         </ErrorBoundary>
//     )
// }
export default withCatcher(withData(
    Demo,
    {
        func: getApiData,
        routeParamsKey: ['dealId', { orderId: 'dealId' }]
    }
));
