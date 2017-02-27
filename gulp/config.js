'use strict';

var gutil = require('gulp-util');

exports.paths = {
  mocha: 'test',
  istanbul: 'test_coverage',
  server:'server'
};
/**
 *  错误处理
 */
exports.errorHandler = function() {
  return function (err) {
    gutil.beep(); //输出一个提示音
    gutil.log(err.toString()); //gulp运行中提供一些日志提示
  }
};