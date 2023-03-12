/**
 * 子午线埋点。
 */

const track:TrackI = {
    pv(pageId) {
        this.send({ type: "pv", pageId });
    },
    expo(eid, eparam?, others?) {
        this.send({ type: "exposure", eid, eparam, others });
    },
    clic(eid, eparam?, others?) {
        this.send({ type: "click", eid, eparam, others });
    },
    /**
     * immediately
     * @param param0
     * @returns
     */
    send({ type = "", pageId = "", eid = "", eparam = "", others = {} } = {}) {
        console.log("[Track]send type:%s, eid:%s", type, eid, eparam, others);

        if (type !== "pv" && !eid) {
            return
        }
        try {
            // post data ...
        } catch (e) {
            console.warn("[Track]error:", e);
        }
    }
}
// track.send = requestIdle(track.sendImm, { ctx: track })

export default track;
