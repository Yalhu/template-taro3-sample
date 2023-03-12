import { View, Text } from "@tarojs/components";
import styles from "./index.module.scss";

interface OwnProps {
    fixed?: boolean;
    text?: string;
}

export default function Loading(props: OwnProps) {
    const { fixed, text } = props;
    return (
        <View className={`${styles.loading} ${fixed && styles.fixed}`}>
            <View className={styles.icon} />
            {
                text &&
                <View className={styles.info}>
                    <Text className={styles.txt}>加载中</Text>
                    <Text className={styles.dot} />
                </View>
            }
        </View>
    );
}
