/**
 * 埋点上报。
 *  - 精简上报，保持h5一致。
 */
const track:TrackI = {
    pv(pageId, eparam?, others?) {
        this.send({ type: "pv", pageId, eparam, others });
    },
    expo(eid, eparam?, others?) {
        this.send({ type: "exposure", eid, eparam, others });
    },
    clic(eid, eparam?, others?) {
        this.send({ type: "click", eid, eparam, others });
    },
    send({ type = "", eid = "", eparam = "", others = {} } = {}) {
        if (type !== "pv" && !eid) {
            return
        }
        // post data ...
        console.log('[Track].send.')
    }

}

export default track;
