interface OtherParams {
    // pparam?: object; // m站page_param
    // elevel?: object; // m站event_level
    abtest?: object; // 棱镜实验数据
}
interface SendParams {
    type?: "pv" | "exposure" | "click";
    eid?: string; // 点击和曝光id
    pageId?: string; // 页面id - h5需要。
    eparam?: object | string | undefined;
    others?: OtherParams;
}
interface TrackI {
    pv: (pageId: string,) => void;
    expo: (eid: string, eparam?: object | string | undefined, others?: OtherParams) => void;
    clic: (eid: string, eparam?: object | string | undefined, others?: OtherParams) => void;
    send: (params: SendParams) => void;
}
