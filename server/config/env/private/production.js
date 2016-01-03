'use strict';

// 生产环境私有配置
// =================================
module.exports = {
  mongo: {
    uri: 'mongodb://localhost/jackblog',
    options: {
      user:'hutublog',          //生产环境用户名
      pass:'hutublog_loveme'    //生产环境密码
    }
  },
  github:{
    clientID:"0f31c68a283e1221ef83",
    clientSecret:"3aefb4298c22b57146a757bdb4151dfe2dfd6568",
    callbackURL:"http://api.jackhu.top/auth/github/callback"
  },
  weibo:{
    clientID:"1743570812",
    clientSecret:"2126c414bccaf1074821d514be28797c",
    callbackURL:"http://api.jackhu.top/auth/weibo/callback"
  },
  qq:{
    clientID:"101237317",
    clientSecret:"38345edc87bfb4487e85d319ca7bb5ab",
    callbackURL:"http://api.jackhu.top/auth/qq/callback"
  }
};
