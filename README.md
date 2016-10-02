# jackblog api express版

[![build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status](https://david-dm.org/jackhutu/jackblog-api-express.svg)](https://david-dm.org/jackhutu/jackblog-api-express) 
[![devDependency Status](https://david-dm.org/jackhutu/jackblog-api-express/dev-status.svg)](https://david-dm.org/jackhutu/jackblog-api-express#info=devDependencies)  

[travis-image]: https://travis-ci.org/jackhutu/jackblog-api-express.svg?branch=master
[travis-url]: https://travis-ci.org/jackhutu/jackblog-api-express

[coveralls-image]: https://coveralls.io/repos/jackhutu/jackblog-api-express/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/jackhutu/jackblog-api-express?branch=master

## 简介
Jackblog 是使用 Node.js + MongoDB + Redis + 其它客户端框架开发的个人博客系统,前后端分离,仿简书模板.    
服务端有: [express 版](https://github.com/jackhutu/jackblog-api-express) , [koa 版](https://github.com/jackhutu/jackblog-api-koa)         
客户端有: [angular1.x 版](https://github.com/jackhutu/jackblog-angular1) , [angular2.x 版](https://github.com/jackhutu/jackblog-angular2) , [react 版](https://github.com/jackhutu/jackblog-react) , [vue 版](https://github.com/jackhutu/jackblog-vue)    
移动端有: [react native 版](https://github.com/jackhutu/jackblog-react-native-redux), [ionic2.0 版](https://github.com/jackhutu/jackblog-ionic2)  
##### 此为服务端Express版, 为客户端提供api. 

## 环境准备
```
node.js 4.0+
mognodb 3.0+
redis 2.8+
```

## 配置
* 配置文件路径: ./server/config/env, 可将私有配置放入./server/config/env/private 下.
* [七牛云存储配置](https://portal.qiniu.com/signup?code=3lg7fovhjx2ky)  

```
  qiniu:{
    app_key:"app_key",
    app_secret:"app_secret",
    domain:"domain",          //七牛配置域名
    bucket:"bucket"           //七牛空间名称  
  },
```
* 七牛不配置也可以运行, 但如果使用[后台管理功能 https://github.com/jackhutu/jackblog-admin](https://github.com/jackhutu/jackblog-admin), 必须配置七牛.

## 开发
```
$ git clone git@github.com:jackhutu/jackblog-api-express.git
$ cd jackblog-api-express
$ npm install
$ gulp serve
```

## [windows 用户注意事项](#windows)
经亲测windows上开发没有任何问题, 测试环境如下:
- windows 7 64位
- mongodb 3.2.6
- [redis 2.8.24](https://github.com/MSOpenTech/redis/releases)
- Python 2.7
- Microsoft Visual Studio C++ 2013

1, node-gyp  
一定要全局安装好node-gyp, ```npm i -g node-gyp```  
这个库依赖python 2.7, vs2013. c++编译环境一定要配置好, 不然很多包都装不了.

2, redis  
redis for windows 只支持64位的操作系统 

## 线上布署
```
$ pm2 start process.json
```
#### 使用docker容器部署所需的要环境变量  
```
MONGO_PORT_27017_TCP_ADDR
MONGO_USERNAME
MONGO_PASSWORD
REDIS_PORT_6379_TCP_ADDR
REDIS_PORT_6379_TCP_PORT
REDIS_PASSWORD
QINIU_APP_KEY
QINIU_APP_SECRET
QINIU_APP_DOMAIN
QINIU_APP_BUCKET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL
WEIBO_CLIENT_ID
WEIBO_CLIENT_SECRET
WEIBO_CALLBACK_URL
QQ_CLIENT_ID
QQ_CLIENT_SECRET
QQ_CALLBACK_URL
```

## 测试
```
$ gulp test
```
配合客户端测试的测试模式   
 
```
$ gulp serve:test
```

## License
MIT