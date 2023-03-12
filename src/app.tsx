import React, { useEffect } from "react";

import { useClick } from "@/hooks";

import "./app.less";

// throw Error('调试badjs')

console.log("[app]start ... ...");

const App: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    /* # 点击埋点监听 */
    useClick([]);

    useEffect(() => {}, []);
    return children as React.ReactElement;
}

export default App;
