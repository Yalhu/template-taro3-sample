import path from 'path'
import fs from 'fs-extra';
import { IPluginContext } from '@tarojs/service';

import buildConfig from '../../config/env'

const { appDirectory, outputRoot } = buildConfig
const outputPath = path.resolve(appDirectory, outputRoot);
// console.log('[plugin-move]build config', buildConfig, outputPath)

const move = (ctx: IPluginContext): void => {
    // ctx.onBuildStart(() => {
    // });
    ctx.onBuildFinish(() => {
        // if (!process.env.BUILD_ENV) return;
        if (process.env.BUILD_ENV === 'mstatic') {
            copyHtmls()
        }
    });
}

/**
 * 处理html文件
 *  把assets中shtml复制到html中。
 */
const copyHtmls = () => {
    const files = fs.readdirSync(outputPath, { withFileTypes: true });
    // console.log("copy-Htmls.files:", files)
    const total = 1 // 全部的html文件
    let num = 0;
    files.map(file => {
        // console.log("copy-Htmls.file:", file)
        const name = file.name
        if (/\.shtml$/.test(name)) {
            const filePath = outputPath + '/' + name
            fs.move(filePath, filePath.replace('assets', 'html'), {
                overwrite: true,
            })
            .then(() => {
                num = num + 1
                // console.log("文件复制完成:", filePath);
                if (num === total) {
                    console.log("全部文件复制完成。");
                }
            })
            .catch(err => {
                console.warn("复制文件出错。", err);
            })
        }

    })

}

export default move;
