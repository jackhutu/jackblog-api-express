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
    gutil.beep();
    gutil.log(err.toString());
  }
};