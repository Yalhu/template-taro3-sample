import { demo as functionId } from "@/consts/apis";
import { get } from "@/utils/Request";

import {
    PayInfoBtnI,
} from "../types";

interface ParamsI {
    orderId: string | undefined;
}
interface ResultI extends ApiResultI {
    body: {
        // appid?: string;
        dealstate: {
            deal_id: string;
            orderType: number;
            orderBackground?: string;
            btnList?: Array<PayInfoBtnI>;
        };
        errorCode: string;
    }
}

export const getApiData = (params: ParamsI): Promise<ResultI> => {
    // 模拟接口请求
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(require('@/mocks/demo-mock.h5')._mock_res)
        }, 1000)
    })
    return get({ functionId, body: { ...params } })
    // .then(() => require('@/mocks/done-mock.weapp')._mock_res)
}
