(function () {

  'use strict';
  var path = require('path');
  var gulp = require('gulp');
  var del = require('del');
  var conf = require('./conf');
  var sass = require('gulp-sass');
  var wiredep = require('wiredep').stream;
  var importCss = require('gulp-import-css');
  var autoprefixer = require('gulp-autoprefixer');


  gulp.task('styles-dist', function () {
    return gulp.src([
        path.join(conf.paths.src, '/styles/*.scss')
      ])
      .pipe(wiredep({
        directory: 'bower_components'
      }))
      .pipe(importCss({}))
      .pipe(sass(conf.sassOptions).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: true
      }))
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
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
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
