(function () {


  'use strict';
  var path = require('path');
  var gulp = require('gulp');
  var conf = require('./conf');

  gulp.task('fonts-dev', function () {
    return gulp.src([
        path.join(conf.paths.src, '/fonts/*.*')
      ])
      .pipe(gulp.dest(
        path.join(conf.paths.dev, '/fonts')
      ));
  });


  gulp.task('fonts-watch-dev', function () {
    gulp.watch([
      path.join(conf.paths.src, '/fonts/*.*')
    ], ['fonts-dev'])
  });

}());
