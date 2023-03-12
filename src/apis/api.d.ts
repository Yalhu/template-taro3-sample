interface ApiResultI {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    code: string;
    message?: string;
    timestamp?: number;
}

/**
 * @depreased: 放置在index中统一管理
 *
 */
// interface ApiConfigI {
//     functionId: string; // color接口functionId
//     appid?: string; // color接口应用id
//     paramsSignId?: string; // 接口加固id
//     umpOperation?: number; // ump接口监控
//     jmfeApiPit?: number; // 烛龙接口测速
//     noSuffixM?: boolean; // 是否有`_m` 后缀
// }
