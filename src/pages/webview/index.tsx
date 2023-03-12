import Taro from "@tarojs/taro";
import { WebView } from "@tarojs/components";

export default function Index() {
    const params = Taro.getCurrentInstance().router?.params;

    const onLoad = e => {
        console.log("loaded", e);
    };

    const onError = e => {
        console.log("error", e);
    };

    if (params?.title) {
        Taro.setNavigationBarTitle({ title: decodeURIComponent(params.title) });
    }

    if (params?.url) {
        const url = decodeURIComponent(params.url);
        console.log("webview. url:%s", url);
        return (
            <WebView {...params} src={url} onLoad={onLoad} onError={onError} />
        );
    }
    return null;
}
