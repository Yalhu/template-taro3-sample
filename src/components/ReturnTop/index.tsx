import React, { useCallback, useState } from "react";
import classNames from "classnames";
import Taro, { usePageScroll } from "@tarojs/taro";
import { View } from "@tarojs/components";

import styles from "./index.less";

export interface Props {
    className?: string
}

const ReturnTopComponent: React.FC<Props> = ({ className, ...rest }) => {
    const [show, setShow] = useState(false);

    usePageScroll(({ scrollTop }) => {
        if (scrollTop > 400) {
            !show && setShow(true);
        } else {
            show && setShow(false);
        }
    });

    const returnTop = useCallback(() => {
        Taro.pageScrollTo({
            scrollTop: 0,
            duration: 300
        });
    }, []);
    return (
        <>
            {!show && null}
            {show && (
                <View
                    className={classNames(styles.return_top, className)}
                    {...rest}
                    onClick={returnTop}
                />
            )}
        </>
    );
}

export default ReturnTopComponent;
