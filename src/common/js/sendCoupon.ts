// import {
//     // drawCoupon,
//     drawResult
// } from "@/apis";
/**
 * 微信发券回调。
 * 小程序发券插件API： https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter9_3_1.shtml#menu2
 * @params {object} item - 按钮数据。
 * @params {object} e.detail - 微信发券回调数据。
 * @params {object} others - 其他数据。比如：orderId
 */
export function handleSendCouponCb(e, item, others?) {
    const detail = e.detail;
    // const { errcode, msg, send_coupon_result = []} = detail;
    console.log('get-Coupon: detail:%o; ', detail, e)
    const { eventType } = item;
    if (["GetCoupon"].includes(eventType)) {
        // drawCoupon({ receiveKey })
    } else if (["GetCouponCallback"].includes(eventType)) {
        // drawResult({ ...others, ...detail, })
    }
}

/**
 * 转化微信发券插件参数。
 *  服务端返回字段和插件要求不一致。
 * @param coupons
 */
export function formatSendCouponParams(coupons) {
    if (!Array.isArray(coupons)) return [coupons]
    return coupons?.map((v) => {
        v.stock_id = v['stockId'];
        v.out_request_no = v['requestNo'];
        v.create_coupon_merchant = v['createCouponMerchant'];
        return v;
    });
}
