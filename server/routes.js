/**
 * Main application routes
 */
'use strict';

var path = require('path');

module.exports = function(app) {
	
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.use('/api/tags',require('./api/tags'));

  app.use('/api/blog',require('./api/blog'));

  app.use('/api/comment', require('./api/comment'));
  
	app.use('/api/logs',require('./api/logs'));

  // var env = app.get('env');
  // if ('development' !== env) {
  //   app.route('/*').get(function(req, res) {
  //       res.sendFile(path.resolve(__dirname, '../' + app.get('appPath') + '/index.html'));
  //   });
  // }
};
