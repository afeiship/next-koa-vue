(function () {

  'use strict';
  var path = require('path');
  var gulp = require('gulp');
  var conf = require('./conf');
  var sass = require('gulp-sass');
  var useref = require('gulp-useref');
  var uglify = require('gulp-uglify');


  gulp.task('jade-dev', function () {
    return gulp.src([
        path.join(conf.paths.src, '/**/*.jade'),
        path.join(conf.paths.src, '*.jade')
      ])
      .pipe(useref())
      .pipe(gulp.dest(path.join(
        conf.paths.dev, '/'
      )));
  });


  gulp.task('jade-watch-dev', function () {
    gulp.watch([
      path.join(conf.paths.src, '/**/*.jade')
    ], ['jade-dev'])
  });




}());
