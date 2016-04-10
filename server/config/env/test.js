'use strict';

// 测试环境配置
// ===========================
module.exports = {
  mongo: {
    uri: 'mongodb://localhost/jackblog-test'
  },
  redis: {
    db: 2
  },
  port:    process.env.PORT || 8080,
  seedDB: true
};