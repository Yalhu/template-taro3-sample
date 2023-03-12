import { useCallback } from "react";
import { View } from "@tarojs/components";

import styles from "./index.less";

interface PropsData {
    data?: {
        dealstate?: {
            dealId?: string
        }
    },
    otherProp?: string, //
    count?: number, //
}
const Comp:React.FC<PropsData> = ({ data, otherProp, count }) => {
    // 处理点击
    const handleClick = useCallback(() => {
    }, []);

    return (
        <View
            className={`${styles.wrapper} expo`}
            data-expid="test-expo-comp1"
        >
            <View
                className={styles.action}
                data-eid="text-eid-comp1"
                onClick={handleClick}
            >
                i am component
            </View>
            {/* {testerrorboundary} */}
            <View
                className={styles.main}
            >
                other props: {JSON.stringify(otherProp)}
            </View>
            <View>count from father: {count}</View>
            <View>
                {
                    data && data.dealstate &&
                    <View>child deal id: {data.dealstate?.dealId}</View>
                }
            </View>

        </View>
    )
}
export default Comp;
