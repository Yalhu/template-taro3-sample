/**
 * 封装空闲执行函数。
 *  - 优先requestIdleCallback，降级定时器。
 * 返回函数。并不执行。
 * @param cb - 目标函数
 * @param param1.timeout - 超时执行时间
 * @param param1.ctx - callback 绑定上下文
 * @returns {function}
 */
const requestIdle = function (cb, { timeout = 800, ctx = null } = {}) {
    let tid;
    return function (...params) {
        // console.log('[requestIdle]', params, ...arguments)
        if (!timeout) {
            return cb.apply(ctx, params)
        }
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                return cb.apply(ctx, params)
            }, { timeout })
        } else {
            if (tid) clearTimeout(tid)
            tid = setTimeout(() => {
                return cb.apply(ctx, params)
            }, timeout);
        }
    }
}

export default requestIdle
