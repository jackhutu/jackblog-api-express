'use strict';

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/env');
var path = require('path');
var fs = require('fs');
var errorHandler = require('errorhandler');

// 连接数据库.
mongoose.connect(config.mongo.uri, config.mongo.options);
var modelsPath = path.join(__dirname, 'model');
fs.readdirSync(modelsPath).forEach(function (file) {
	if (/(.*)\.(js$|coffee$)/.test(file)) {
		require(modelsPath + '/' + file);
	}
});

// 初始化数据
if(config.seedDB) { require('./config/seed'); }

var app = express();

require('./config/express')(app);
require('./routes')(app);

if ('development' === config.env) {
  app.use(errorHandler());
}else{
	app.use(function (err, req, res, next) {
	  return res.status(500).send();
	});
}

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;
