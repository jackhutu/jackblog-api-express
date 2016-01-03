'use strict';

var path = require('path');

module.exports = function(app) {
	
  app.use('/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.use('/tags',require('./api/tags'));

  app.use('/article',require('./api/article'));

  app.use('/comment', require('./api/comment'));
  
	app.use('/logs',require('./api/logs'));

};
