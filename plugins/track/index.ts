import * as path from "path";
import { isArray, isString } from "@tarojs/shared";
import { IPluginContext } from '@tarojs/service';

// console.log("[Plugin-track]");
/**
 * 埋点点击。
 * @param ctx
 */
export default (ctx: IPluginContext): void => {
    ctx.registerMethod({
        name: "onSetupClose",
        fn: (platform) => {
            const injectedPath = path.join(__dirname, "./runtime");
            // console.log("[Plugin-track]onSetupClose.", injectedPath, platform.runtimePath);
            if (isArray(platform.runtimePath)) {
                platform.runtimePath.push(injectedPath);
            } else if (isString(platform.runtimePath)) {
                platform.runtimePath = [platform.runtimePath, injectedPath];
            }
        }
    });
}
