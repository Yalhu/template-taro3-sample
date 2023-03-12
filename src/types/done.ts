// 订单支付信息
export interface PayInfoI {
    dealPayFeeTotal: string,
    orderDetailLink?: string,
    btnList?: Array<PayInfoBtnI>,
    textActivityList?: Array<TextActivityI>,
    globalPurchaserInfo?: GlobalPurchaserInfoI,
    orderBackground?: string;
    // payInfoStyle?: string,
    // ppmsDataView?: PpmsDataViewI,
    // isNeedOrderHook?: boolean,
    // doneConfig?: DoneConfigI,
}

// 全球购实名认证
export interface GlobalPurchaserInfoI {
    buttonText: string, // 操作按钮文案
    buttonUrl: string, // 落地页
    authentication: string, // 展示文案
}

// 文本配置链接
export interface TextActivityI {
    name: string, // 配置内容
    labelImg: string, // icon图标
    jumpUrl?: string, // 落地页地址
    text: string, // 文案信息
}

// 支付页面按钮
export interface PayInfoBtnI {
    id: string,
    // id: ["goHome" | "orderDetail" | "train"],
    btnBackground?: string, // 背景图片。 首页按钮有
    btnFrameColor?: string, // 边框颜色。除首页按钮外有
    btnTextColor?: string, // 文案颜色。
    link?: string, // 跳转链接
    name?: string, // 文案
}
// 订单商品信息
export interface OrderWareI {
    cid?: string;
    cid1?: string;
    cid2?: string;
    skuId: string;
    shopId: string;
}

// 新人三单礼
export interface NewcomerDataI {
    title: string,
    activityRuleName: string,
    activityRuleNameLink: string,
    rewardList: Array<NewcomerRewardI>,
}
export interface NewcomerRewardI {
    buttonId: string, // 按钮的状态标识
    buttonLink: string, // 跳转链接
    buttonName: string,
    discount: string,
    title: string,
    typeName: string,
}

// 资源位入口
export interface ResourceEntryI {
    icon: string,
    name: string, // 内容
    type: ["normal" | "group"], // group 目前没有用到。
    cid?: string,
    mainTitle: string, // 主标题
    subTitle: string, // 副标题
    buttonText: string, // 按钮文案
    url: string,
}

// 活动广告
export interface ActivityBannerI {
    activityType: string; // 活动类型。
    bannerJumpUrl: string; // 落地页地址
    bannerUrl: string; // 图片地址
    endTime: string;
    name: string; // 文案
    startTime: string;
}

// 首购弹窗
export interface RewardDataI {
    jumpOutLink: string,
    jumpOutHint: string,
    discount: string,
    rewardIdent: number, // 0:优惠券 1:红包
}
// 单单返利
export interface OrderRewardI {
    text: string, // 展示文案
    buttonName: string,
    buttonLink: string,
    discount: string, // 奖励金额
    imageLink: string // 图片链接
}
