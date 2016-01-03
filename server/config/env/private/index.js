'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');

// 本地私有配置,可覆盖其它配置.
// ==================================
var privateConfig = {
  secrets: {
    session: "I have a secret couldn't say"
  },
  qiniu:{
    app_key:"PwzqDkZHPwAXI_gVD7qkNrg1mhD5Dsv8FLbTMGcC",
    app_secret:"9UW4KFCewwgvFkg4UB-TXONQ4P0RxfkUOuutuozz",
    domain:"http://upload.jackhu.top/",
    bucket:"jackhublog" 
  }
};

if (fs.existsSync(path.join(__dirname, '/' + process.env.NODE_ENV + '.js'))) {
  privateConfig = _.merge(privateConfig, require('./' + process.env.NODE_ENV + '.js') || {});
}

module.exports = privateConfig;