import React from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
// import { report } from "~/utils";

import styles from "./index.less";

console.log('[ErrorBoundary]start ...', Taro.interceptors)
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log('[ErrorBoundary]error', error)
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary]catcher", error, errorInfo);
        // if (process.env.NODE_ENV !== "development") {
        //     report.badjs(`${error.name}: ${error.message}\r\n${error.stack || ""}`, "render");
        // }
    }

    handleReload = () => {
        this.setState({
            hasError: false
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View className={styles.container}>
                    <Image className={styles.icon} mode="aspectFit" src="//img.alicdn.com/tfs/TB1eZPBmMoQMeJjy1XaXXcSsFXa-220-220.png_110x110.jpg" />
                    <Text className={styles.text}>抢购异常火爆，请稍后再试</Text>
                    <Button className={styles.btn} onClick={this.handleReload}>重试</Button>
                </View>
            );
        }
        return this.props.children
    }
};

export default ErrorBoundary;
