/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
    interface ProcessEnv {
        BUILD_ENV: 'beta'| 'mstatic' | 'wxapp' | 'wxabuild';
        TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
        VERSION: string;
    }
}
interface Window {
    webkit: any;
    mqq: any;
    wx: any;
    myapp: any;
    WeixinJSBridge: any;
    $: any;
}

declare const myapp: any;
declare const wx: any;
declare const ks: any;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            item: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

declare namespace JSX {
    interface IntrinsicElements {
        "ReturnTop": {
        },
        "recommend": {
            extraProps: object;
        },
        "quick-nav": {
            wxappPageUrl: string;
            bottom: string;
            children?: React.ReactNode;
        },
        "nav-bar": {
            navBarData: object;
            onGetnavinfo?: (e) => void;
            children?: React.ReactNode;
        }
    }
}
