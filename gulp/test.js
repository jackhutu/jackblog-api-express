'use strict';

var path = require('path');
var gulp = require('gulp');
var config = require('./config');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var env = require('gulp-env');
var gulpSequence = require('gulp-sequence');
var coveralls = require('gulp-coveralls');

//设置环境变量,mocha,istanbul测试必须在test mode
gulp.task('set-env', function () {
	env({
		vars: {
			'NODE_ENV':'test'
		}
	});
});
//istanbul
gulp.task('pre-test', function () {
  return gulp.src([
						path.join(config.paths.server,'/**/*.js'),
						path.join('!' + config.paths.server,'/config/**/*.js'),
						path.join('!' + config.paths.server,'/auth/**/*.js'),
						path.join('!' + config.paths.server,'/{app,routes}.js'),
						path.join('!' + config.paths.server,'/model/**/*.js')
					])
					.pipe(istanbul()) // Covering files
					.pipe(istanbul.hookRequire()) 
});

gulp.task('test:istanbul',['set-env','pre-test'],function () {

		gulp.src(path.join(config.paths.mocha,'/**/*.test.js'),{read: false})
				.pipe(mocha({
					require: ['should'],
					timeout: 5000
				}))
				.pipe(istanbul.writeReports({
					dir: path.join(config.paths.istanbul,'/')
				}))
				.once('error', function () {
				    process.exit(1);
				})
				.once('end', function () {
				    process.exit();
				});

});
//mocha test
gulp.task('test:mocha',['set-env'],function () {
	gulp.src(path.join(config.paths.mocha,'/**/*.test.js'),{read: false})
			.pipe(mocha({
				reporter: 'list',		//list,nyan,spec(default),progress
				require: ['should'],
				timeout: 5000
			}))
			.once('error', function () {
			    process.exit(1);
			})
			.once('end', function () {
			    process.exit();
			});
});
//coveralls
gulp.task('coveralls',function () {
	gulp.src(path.join(config.paths.istanbul, '/lcov.info'))
		.pipe(coveralls());
});

gulp.task('test',gulpSequence('test:istanbul'));
