import buildConfig from '../config/env'

// console.log('build-Config', buildConfig)

const config = {
    pages: buildConfig.pages,
    components: [
    ],
    permission: {
        // "scope.userLocation": {
        //     "desc": "我们需要您的地址信息来判断商品是否有货等信息"
        // }
    },
    window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'WeChat',
        navigationBarTextStyle: 'black'
    },
    networkTimeout: {
        "request": 8000,
        "connectSocket": 10000,
        "uploadFile": 10000,
        "downloadFile": 10000
    }
}

export default config;
