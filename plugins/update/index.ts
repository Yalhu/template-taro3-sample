import { IPluginContext } from '@tarojs/service';

interface Page {
    name: string;
    path: string;
    isNative: boolean;
    stylePath?: string;
    templatePath?: string;
}

const update = (ctx: IPluginContext): void => {
    ctx.modifyBuildAssets((rest) => {
        const blended = ctx.runOpts.blended || ctx.runOpts.options.blended;
        if (!blended) return;
        
        const pages: Array<Page> = rest.miniPlugin.pages;
        pages.forEach((page) => {
            const target = rest.assets[`${page.name}.wxss`];
            if (target) {
                target._value = `@import "${page.name.split("/").map((_item, index, array) => index === array.length - 1 ? "app.wxss" : "..").join("/")}";\r\n ${target._value}`;
            }
        });
    });
}

export default update;
