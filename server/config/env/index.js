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
  }
};

var config = _.merge(all,require('./' + process.env.NODE_ENV + '.js') || {});
//加载私有配置
if (fs.existsSync(path.join(__dirname, 'private/index.js'))) {
  config = _.merge(config, require(path.join(__dirname, 'private/index.js')) || {});  
}
module.exports = config;
