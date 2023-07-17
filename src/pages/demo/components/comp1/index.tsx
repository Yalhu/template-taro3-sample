import React, { useCallback } from "react";
import { View, Text } from "@tarojs/components";

import { comp_expo } from '@/consts/ea-points/demo'

import styles from "./index.less";

interface PropsData {
    propParam?: string, // 订单id
}
const Comp: React.FC<PropsData> = ({ propParam }) => {
    // 处理点击
    const handleClick = useCallback(() => {
    }, []);

    return (
        <View
            className={`${styles.wrapper} expo`}
            data-expid={comp_expo}
        >
            <View
                className={styles.action}
                data-eid="text-eid-comp1"
                onClick={handleClick}
            >
                i am component
            </View>
            <Text
                className={styles.main}
            >
                propParam: {propParam}
            </Text>
            {/* {testerrorboundary} */}
        </View>
    )
}
export default Comp;
