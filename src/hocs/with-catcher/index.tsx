import React from "react";
// import { View, Text, Button, Image } from "@tarojs/components";
// import { report } from "~/utils";

import Error from '@/components/Error'

export interface CatcherState {
    hasError: boolean;
    error?: Error;
}

const withCatcher = <T extends unknown>(WrappedComponent: React.ComponentType<T>): React.ComponentClass<T, CatcherState> => {
    return class extends React.Component<T, CatcherState> {
        static getDerivedStateFromError(error): CatcherState {
            return { hasError: true, error };
        }

        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        componentDidCatch(error, errorInfo) {
            console.error("catcher", error, errorInfo);
            // if (process.env.NODE_ENV !== "development") {
            //     report.badjs(`${error.name}: ${error.message}\r\n${error.stack || ""}`, "render");
            // }
        }

        handleReload = () => {
            this.setState({
                hasError: false
            });
        }

        render(): JSX.Element {
            if (this.state.hasError) {
                return (
                    <Error
                        info="抢购异常火爆，请稍后再试"
                        image="//img.alicdn.com/tfs/TB1eZPBmMoQMeJjy1XaXXcSsFXa-220-220.png_110x110.jpg"
                        customClass="fixed"
                        btnText="重试"
                        onBtnFun={this.handleReload}
                    />
                );
            }
            return <WrappedComponent {...this.props} />;
        }
    };
}

export default withCatcher;
