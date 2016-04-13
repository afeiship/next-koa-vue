(function () {

  'use strict';

  var path = require('path');
  var gulp = require('gulp');
  var conf = require('./conf');
  var del = require('del');


  gulp.task('clean', function () {
    return del([
      path.join(conf.paths.dist, '/'),
      path.join(conf.paths.dev, '/')
    ]);
  });

}());
