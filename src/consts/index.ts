/* ## 小程序页面路径  */
// 首页
export const homeUrl = process.env.TARO_ENV === 'weapp' ? '/pages/index/index?' : '//home.m.com?';
// 订单列表页
export const orderListUrl = process.env.TARO_ENV === 'weapp'
    ? '/pages/order/pages/list/index?'
    : '//order.m.com/orderlist.shtml?'

/* ## h5页面路径 */
// m站登录态同步中间页
export const pinbindUrl = `https://user.m.com/pinbind/pintokenredirect?`;
