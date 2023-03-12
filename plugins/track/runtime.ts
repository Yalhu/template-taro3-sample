import { mergeReconciler } from "@tarojs/shared";

console.log("[Plugin-track]. runtime...");
mergeReconciler({
    modifyDispatchEvent: (e) => {
        // console.log("[Plugin-track]modify-Dispatch-Event", e);
        if (e.type === "tap") {
            const dataset = e.currentTarget && e.currentTarget.dataset;
            const eid = dataset.eid;
            if (!dataset || !eid) {
                return;
            }
            const eparam = dataset.eparam;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const runtime = require("@tarojs/runtime");
            const event = new runtime.TaroEvent("tracks", {
                bubbles: true,
                cancelable: true
            }, {
                detail: {
                    eid,
                    eparam
                }
            });

            runtime.document.dispatchEvent(event);
        }
    }
});
