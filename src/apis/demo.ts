import { get } from "@/utils/Request";

import {
    PayInfoBtnI,
    RewardDataI,
} from "../types";

const functionId = "demo_api";
interface ParamsI {
    orderId: string | undefined;
}
interface ResultI extends ApiResultI {
    body: {
        dealstate: {
            deal_id: string;
            btnList?: Array<PayInfoBtnI>;
            /* ## 页面弹窗 */
            rewardResult?: RewardDataI;
        };
        errorCode?: string;
    }
}

export const getApiData = (params: ParamsI): Promise<ResultI> => {
    // 模拟接口请求
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(require('@/mocks/demo-mock.h5')._mock_res)
        }, 3000)
    })
    // 实际接口请求
    return get({ functionId, body: { ...params } })
    // .then(() => require('@/mocks/demo-mock.h5')._mock_res)
}
