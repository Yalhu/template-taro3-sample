/**
 * 小程序发券插件API: https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter9_3_1.shtml
 */
// 微信发券插件入参
interface SendCouponParamI {
    coupons: {stock_id:string, out_request_no: string;}[],
    merchantCode: string,
    sign: string,
}

// 微信发券插件回调数据 // 方便直接测试接口
interface SendCouponCallbackDetailI {
    errcode?: string,
    msg?: string,
    send_coupon_result?: SendCouponResultI,
}
interface SendCouponResultI {
    code: string,
    message: string,
    stock_id: string,
    coupon_code: string,
    out_request_no: string,
}
