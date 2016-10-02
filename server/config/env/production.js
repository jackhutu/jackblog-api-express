'use strict';

// 生产环境配置
// =================================
var MONGO_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || "localhost";

module.exports = {
  port: process.env.PORT || 8800,
  //生产环境mongodb配置
  mongo: {
    uri: 'mongodb://' +  MONGO_ADDR + '/jackblog'
  },
  //生产环境redis配置
  redis: {
    db: 1,
    dropBufferSupport: true
  },
  //生产环境cookie是否需要domain视具体情况而定.
  session:{
    cookie:  {domain:'.jackhu.top',maxAge: 60000*5}
  }
};
