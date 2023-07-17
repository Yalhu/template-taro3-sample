interface SendParams {
    type?: "pv" | "exposure" | "click"; // 小程序保持 和 h5统一。h5的pv需要和点击/曝光一起处理。
    eid?: string; // 点击和曝光id
    pageId?: string; // 页面id。 小程序会带到埋点和曝光。
    // pparam?: any; // 页面参数。sdk会上报
    eparam?: any; // 不限制
    others?: any;
}
interface TrackI {
    pv: (pageId: string, eparam?: any, others?: any) => void;
    expo: (eid: string, eparam?: any, others?: any) => void;
    clic: (eid: string, eparam?: any, others?: any) => void;
    send: (params: SendParams) => void;
}
