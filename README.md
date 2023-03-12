
基于Taro构建的跨端项目    
多项目/业务模块复用。  
1. 可以运行在原生小程序，复用原生小程序内能力。
   产物直接生产至目标路径。
   避免重复开发，减少包大小。
2. 可以运行h5项目。
3. 可复用的工具，组件，通用能力等。
   比如：webpack构建，lint检查，git提交规范；
    request，track，report，router。
    高阶组件with-cather, with-data;推荐组件跨端兼容。
    属性方式进行点击埋点，曝光埋点。
4. 通过env配置打包不同的项目。
<!-- 抽离公共依赖 -->
<!-- 5. 通过git submodule管理pages下项目 -->

<!-- 注：又不是不能用。 -->

<!-- 只提供了项目的框架。及一些简单实现 -->
<!-- 
单元测试未调试。
ts按照实际使用。 
-->

## 项目开发
### 运行
```bash
## 安装
npm install -g pnpm
pnpm install

## h5
### h5开发模式
npm run dev:h5
### h5 部署预发
npm run build:h5-beta
### h5 产物移到目标位置
npm run build:h5-mstatic

## 小程序
### 微信小程序开发模式
npm run dev:weapp-wxabuild
### 微信小程序部署
npm run prod:weapp-wxabuild
### 小程序 产物移到目标位置
npm run prod:weapp-wxapp
```
### 打包配置
#### 通用
通过env建立不同的应用，比如buy，order，my，cart等。  
BUILD_ENV 隔离不同的打包环境。<!-- taro构建的时候会移除掉 -->
#### 小程序
- 原生小程序开发时，直接生产到wxapp/wxa-build或waxapp/miniapp/pages。
- 配置原生小程序下项目根路径`~` 。通过该路径引入原生项目依赖。
#### h5
- h5项目开发环境添加页面片（线上ssi方式）。
- 开发模式通过代理域名访问页面。<!-- 和线上一致 -->
- 单页应用browser模式。
    自定义路由。构建生成多页html文件<!-- （还是单页应用，不需要配置nginx） -->。
<!-- PS: taro 路由 mutil模式，文档内不是很建议 -->
### 目录结构
config/: 打包配置。  
src/libs/： 第三方的依赖库等。  
src/common/: 页面公用依赖，或者配置文件。  
src/components/: 公共组件。  
test/： 单元测试。  
### 功能
\### utils
#### 接口请求
taro原生请求，添加Interceptor处理。  
note: 基础功能，可以重新定义。  

#### 埋点
useClick, useExpose 实现统一属性埋点。  
埋点id集中在common/js/ea-points 管理。  
曝光埋点空闲时间上报。  

注：埋点上报自行实现。

\### hoc
#### 统一页面ui
with-cather：异常兜底展示。  
with-data：页面/组件（异步）数据loading/skeleton，error处理。  
<!-- 懒加载lazy，Suspense -->

note: 可以按照实际需要引入useRequest hooks 封装接口请求。  
#### 
