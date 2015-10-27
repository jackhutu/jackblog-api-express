'use strict';

var gulp = require('gulp');
var config = require('./config');
var path = require('path');

var nodemon = require('gulp-nodemon');

//默认development模式
gulp.task('nodemon',function () {
	nodemon({
	  script: path.join(config.paths.server,'/app.js'), 
	  ext: 'js',
	  watch: [
	    path.join(config.paths.server,'/')
	  ]
	})
});
//test模式
gulp.task('nodemon:test',function () {
	//http://localhost:8080  test mode
	nodemon({
	  script: path.join(config.paths.server,'/app.js'), 
	  ext: 'js json',
	  watch: [
	    path.join(config.paths.server,'/')
	  ],
	  env: { 'NODE_ENV': 'test' }
	})
});
//production模式
gulp.task('nodemon:production',function () {
	nodemon({
	  script: path.join(config.paths.server,'/app.js'), 
	  ext: 'js json',
	  watch: [
	    path.join(config.paths.server,'/')
	  ],
	  env: { 'NODE_ENV': 'production' }
	})
});


gulp.task('serve',['nodemon']);
gulp.task('serve:test',['nodemon:test']);
gulp.task('serve:production',['nodemon:production']);

