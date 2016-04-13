(function () {

  'use strict';
  var path = require('path');
  var gulp = require('gulp');
  var del = require('del');
  var conf = require('./conf');
  var sass = require('gulp-sass');
  var wiredep = require('wiredep').stream;
  var importCss = require('gulp-import-css');


  gulp.task('styles-dist', function () {
    return gulp.src([
        path.join(conf.paths.src, '/styles/*.scss')
      ])
      .pipe(wiredep({
        directory: 'bower_components'
      }))
      .pipe(importCss({}))
      .pipe(sass(conf.sassOptions).on('error', sass.logError))
      .pipe(gulp.dest(
        path.join(conf.paths.dist, '/styles')
      ));
  });

  gulp.task('styles-dev', function () {
    return gulp.src(path.join(
      conf.paths.src, '/styles/*.scss'
      ))
      .pipe(wiredep({
        directory: 'bower_components'
      }))

      .pipe(sass(conf.sassOptions).on('error', sass.logError))
      .pipe(importCss({}))
      .pipe(gulp.dest(
        path.join(conf.paths.dev, '/styles')
      ));
  });


  gulp.task('styles-watch-dev', function () {
    gulp.watch([
      path.join(conf.paths.src, '/styles/*.scss')
    ], ['styles-dev'])
  });


}());
