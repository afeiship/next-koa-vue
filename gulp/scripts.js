(function () {

  'use strict';
  var path = require('path');
  var gulp = require('gulp');
  var conf = require('./conf');
  var flatten = require('gulp-flatten');
  var gulpFilter = require('gulp-filter');
  var concat = require('gulp-concat');
  var mainBowerFiles = require('main-bower-files');

  gulp.task('scripts-vendor-dev', function () {
    var jsFilter = gulpFilter('*.js');
    return gulp.src(mainBowerFiles())
      .pipe(jsFilter)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(path.join(conf.paths.dev, '/scripts')));
  });

  gulp.task('scripts-app-dev', function () {
    return gulp.src([
        path.join(conf.paths.src, '/scripts/*.js')
      ])
      .pipe(gulp.dest(path.join(conf.paths.dev, '/scripts')));
  });

  gulp.task('scripts-dev', [
    'scripts-vendor-dev',
    'scripts-app-dev'
  ]);


  gulp.task('scripts-watch-dev', function () {
    gulp.watch([
      path.join(conf.paths.src, '/scripts/**/*.js')
    ], ['scripts-dev'])
  });


}());
