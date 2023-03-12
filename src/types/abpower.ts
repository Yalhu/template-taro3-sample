// 棱镜实验
export interface AbPowerI {
    buriedExpLabel?: string,
    expId: string,
    expLabel?: string,
    expLabelParams?: string,
}

export interface AbTestI {
    readonly [propsname: string]: string,
}
