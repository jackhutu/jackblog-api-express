'use strict';

var path = require('path');

module.exports = function(app) {
	
  app.use('/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.use('/tags',require('./api/tags'));

  app.use('/article',require('./api/article'));

  app.use('/comment', require('./api/comment'));
  
	app.use('/logs',require('./api/logs'));

	app.use('/mobile',require('./api/mobile'));

	app.use('/*', function (req,res,next) {
		return res.json({status:'success',data:'台湾是中国不可分割的一部分.'});
	})
};
