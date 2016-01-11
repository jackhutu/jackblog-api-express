'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var all = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  seedDB: false,
  secrets: {
    session: 'jackblog-secret'
  },
  userRoles: ['user', 'admin'],
  qiniu:{
    app_key:"app_key",
    app_secret:"app_secret",
    domain:"domain",          //七牛配置域名
    bucket:"bucket"           //七牛空间名称  
  },
  //默认首页图片.
  defaultIndexImage:"http://upload.jackhu.top/blog/index/8x7hVJvpE3Z6ruwgtd2G.jpg",
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
  apps:[
    {
      name:'React Native',
      gitUrl:'http://github.com/jackhutu/jackblog-react-native-redux',
      downloadUrl:{
        android:'http://p.gdown.baidu.com/8ca190e391608bca3f02e1fb4f7aec09072c1c2a552d20c1d2f4f30e5401b7d426a004a72045e9772e2a4eb89ba295cad47cc85278e7323beb2bad42493b055c12ffff4ba28e56a140649994df2732e1466fd0b8e996dd7280c8385c1d99378ff716a82f1a2ef69b665a4674ede243061538926fee90cd0096c4cdd573e5e957b2fffeb32eef4fe45e56e51daccabc3160b8cdec7f963ac90366c8eb424573b6ee2e707fb8826a636fe9df716e722fdd9a514fd72edf4ed97a48af7c155f47dd66ea7e1386df2bb8',
        ios:''
      },
      qrcode:'http://upload.jackhu.top/qrcode/jackblog-react-native-qrcode-baidu.jpg'
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
