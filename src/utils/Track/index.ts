/**
 * 埋点。
 */
// import { requestIdle } from '@/utils'

const track:TrackI = {
    pv(pageId) {
        this.send({ type: "pv" });
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
        // const { /* pparam,  */abtest } = others || {};
        // post data ...
        // const inst = instance;
    }

}

export default track;
