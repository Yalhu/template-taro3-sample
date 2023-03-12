// import Taro from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";

import styles from "./index.less";

// console.log('[Error]start ...')
interface Props {
    image?: string;
    info?: string;
    btnText?: string;
    customClass?: string;
    // onShow?: (params?: any) => void;
    onBtnFun?: () => void;
    // onRetry?: (params?: any) => void;
    // errorBody?: any;
}
export default function Error(props: Props) {
    const {
        info,
        image,
        btnText,
        customClass,
        onBtnFun,
    } = props;
    console.log('[Error]props', props)

    return (
        <View className={`${styles.container} ${customClass && styles[customClass]}`}>
            <Image className={styles.icon} mode="aspectFit" src={image || '//img.alicdn.com/tfs/TB1eZPBmMoQMeJjy1XaXXcSsFXa-220-220.png_110x110.jpg'} />
            <Text className={styles.info}>{info || '抢购异常火爆，请稍后再试'}</Text>
            {
                btnText &&
                <Button className={styles.btn} onClick={onBtnFun}>{btnText}</Button>
            }
        </View>
    );
}
