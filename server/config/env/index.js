'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var all = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,
  //mongodb配置
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  //redis 配置
  redis: {
    host: '127.0.0.1',
    port: 6379
  },
  //是否初始化数据
  seedDB: false,
  session:{
    secrets: 'jackblog-secret',
  },
  //用户角色种类
  userRoles: ['user', 'admin'],
  //七牛配置
  qiniu:{
    app_key:'',
    app_secret:'',
    domain:'',          //七牛配置域名
    bucket:''           //七牛空间名称  
  },
  //默认首页图片.
  defaultIndexImage:"http://upload.jackhu.top/blog/index/8x7hVJvpE3Z6ruwgtd2G.jpg",
  //第三方登录配置
  github:{
    clientID:"github",
    clientSecret:"clientSecret",
    callback:"/auth/github/callback"
  },
  weibo:{
    clientID:"clientID",
    clientSecret:"clientSecret",
    callbackURL:"/auth/weibo/callback"
  },
  qq:{
    clientID:"clientID",
    clientSecret:"clientSecret",
    callbackURL:"/auth/qq/callback"
  },
  //移动APP列表
  apps:[
    {
      name:'React Native',
      gitUrl:'http://github.com/jackhutu/jackblog-react-native-redux',
      downloadUrl:{
        android:'http://a.app.qq.com/o/simple.jsp?pkgname=top.jackhu.reactnative',
        ios:''
      },
      qrcode:'http://upload.jackhu.top/qrcode/jackblog-react-native-qrcode.png'
    },
    {
      name:'Ionic 2.0',
      gitUrl:'http://github.com/jackhutu/jackblog-ionic2',
      downloadUrl:{
        android:'http://upload.jackhu.top/downloads/Jackblog-ionic2-1.0.0.apk',
        ios:''
      },
      qrcode:'http://upload.jackhu.top/qrcode/jackblog-ionic2-v1.0.0.png'
    }
  ],
  //开启第三方登录
  snsLogins:['github','qq']
};

var config = _.merge(all,require('./' + process.env.NODE_ENV + '.js') || {});
//加载私有配置
if (fs.existsSync(path.join(__dirname, 'private/index.js'))) {
  config = _.merge(config, require(path.join(__dirname, 'private/index.js')) || {});  
}
module.exports = config;
