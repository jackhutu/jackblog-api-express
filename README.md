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
客户端有: [angular1.x 版](https://github.com/jackhutu/jackblog-angular1) , [angular2.x 版](https://github.com/jackhutu/jackblog-angular2) , [react redux 版](https://github.com/jackhutu/jackblog-react-redux) , [vue 版](https://github.com/jackhutu/jackblog-vue)    
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


## 开发
```
$ git clone git@github.com:jackhutu/jackblog-api-express.git
$ cd jackblog-api-express
$ npm install
$ gulp serve
```

## 线上布署
```
$ pm2 start process.json
```
可参考[利用git和pm2一键布署项目到vps](http://jackhu.top/article/55cd8e00c6e998b817a930c7)

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